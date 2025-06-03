from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _
from .models import Devolucion, HistorialEstadoDevolucion, DocumentoDevolucion

class DocumentoDevolucionInline(admin.TabularInline):
    model = DocumentoDevolucion
    extra = 1
    readonly_fields = ('fecha_creacion', 'vista_previa')
    fields = ('archivo', 'vista_previa', 'descripcion', 'fecha_creacion')
    
    def vista_previa(self, obj):
        if obj.archivo:
            if obj.archivo.name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                return format_html(
                    '<a href="{}" target="_blank">' 
                    '<img src="{}" style="max-height: 100px;" />' 
                    '</a>',
                    obj.archivo.url, obj.archivo.url
                )
            return format_html(
                '<a href="{}" target="_blank">Ver documento</a>',
                obj.archivo.url
            )
        return "Sin archivo"
    vista_previa.short_description = 'Vista previa'
    vista_previa.allow_tags = True

class HistorialEstadoDevolucionInline(admin.TabularInline):
    model = HistorialEstadoDevolucion
    extra = 0
    readonly_fields = ('fecha_cambio', 'usuario', 'estado_anterior', 'estado_nuevo', 'notas')
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Devolucion)
class DevolucionAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'cliente', 'tipo', 'estado_badge', 'monto_formateado',
        'fecha_solicitud_formateada', 'acciones'
    )
    list_filter = ('tipo', 'estado', 'fecha_solicitud')
    search_fields = (
        'cliente__usuario__username', 'cliente__usuario__email',
        'producto_devuelto__nombre', 'vehiculo_devuelto__modelo'
    )
    list_select_related = ('cliente__usuario', 'producto_devuelto', 'vehiculo_devuelto')
    readonly_fields = (
        'fecha_solicitud', 'fecha_resolucion', 'monto', 'estado_actual',
        'historial_estados', 'documentos_lista'
    )
    inlines = [DocumentoDevolucionInline, HistorialEstadoDevolucionInline]
    
    fieldsets = (
        ('Información General', {
            'fields': ('cliente', 'tipo', 'estado', 'motivo')
        }),
        ('Detalles del Producto/Vehiculo', {
            'fields': ('producto_devuelto', 'vehiculo_devuelto'),
            'classes': ('collapse',)
        }),
        ('Información de la Devolución', {
            'fields': ('monto', 'comentario', 'fecha_solicitud', 'fecha_resolucion')
        }),
        ('Documentos Adjuntos', {
            'fields': ('documentos_lista',),
            'classes': ('collapse',)
        }),
        ('Historial', {
            'fields': ('estado_actual', 'historial_estados'),
            'classes': ('collapse',)
        }),
    )
    
    def estado_badge(self, obj):
        estado_classes = {
            'PENDIENTE': 'badge badge-warning',
            'APROBADA': 'badge badge-success',
            'RECHAZADA': 'badge badge-danger',
            'EN_PROCESO': 'badge badge-info',
            'COMPLETADA': 'badge badge-secondary',
        }
        return format_html(
            '<span class="{}">{}</span>',
            estado_classes.get(obj.estado, 'badge badge-secondary'),
            obj.get_estado_display()
        )
    estado_badge.short_description = 'Estado'
    estado_badge.admin_order_field = 'estado'
    estado_badge.allow_tags = True
    
    def monto_formateado(self, obj):
        if obj.monto is not None:
            return f"${obj.monto:,.2f}"
        return "N/A"
    monto_formateado.short_description = 'Monto'
    monto_formateado.admin_order_field = 'monto'
    
    def fecha_solicitud_formateada(self, obj):
        return obj.fecha_solicitud.astimezone(timezone.get_current_timezone()).strftime('%d/%m/%Y %H:%M')
    fecha_solicitud_formateada.short_description = 'Fecha de Solicitud'
    fecha_solicitud_formateada.admin_order_field = 'fecha_solicitud'
    
    def estado_actual(self, obj):
        return self.estado_badge(obj)
    estado_actual.short_description = 'Estado Actual'
    estado_actual.allow_tags = True
    
    def documentos_lista(self, obj):
        documentos = obj.documentos.all()
        if not documentos:
            return "No hay documentos adjuntos"
            
        items = []
        for doc in documentos:
            items.append(
                f'<li>'
                f'<a href="{doc.archivo.url}" target="_blank">{doc.descripcion or doc.archivo.name}</a> '
                f'({doc.fecha_creacion.astimezone(timezone.get_current_timezone()).strftime("%d/%m/%Y %H:%M")})'
                f'</li>'
            )
        return mark_safe(f'<ul>{"".join(items)}</ul>')
    documentos_lista.short_description = 'Documentos Adjuntos'
    documentos_lista.allow_tags = True
    
    def historial_estados(self, obj):
        historial = obj.historial_estados.all().order_by('-fecha_cambio')
        if not historial:
            return "No hay historial de cambios de estado"
            
        rows = []
        for h in historial:
            rows.append(
                f"<tr>"
                f"<td>{h.fecha_cambio.astimezone(timezone.get_current_timezone()).strftime('%d/%m/%Y %H:%M')}</td>"
                f"<td>{h.estado_anterior} → {h.estado_nuevo}</td>"
                f"<td>{h.usuario.username if h.usuario else 'Sistema'}</td>"
                f"<td>{h.notas or ''}</td>"
                f"</tr>"
            )
        
        return mark_safe(
            f'<table class="table">'
            f'<thead><tr>'
            f'<th>Fecha</th>'
            f'<th>Cambio de Estado</th>'
            f'<th>Usuario</th>'
            f'<th>Notas</th>'
            f'</tr></thead>'
            f'<tbody>{"".join(rows)}</tbody>'
            f'</table>'
        )
    historial_estados.short_description = 'Historial de Estados'
    historial_estados.allow_tags = True
    
    def acciones(self, obj):
        if obj.estado == 'PENDIENTE':
            return format_html(
                '<div class="btn-group">'
                '<a class="button" href="{}?estado=APROBADA" style="background-color: #28a745; color: white; padding: 5px 10px; border-radius: 4px; margin-right: 5px;">Aprobar</a>'
                '<a class="button" href="{}?estado=RECHAZADA" style="background-color: #dc3545; color: white; padding: 5px 10px; border-radius: 4px;">Rechazar</a>'
                '</div>',
                reverse('admin:devoluciones_devolucion_change', args=[obj.id]),
                reverse('admin:devoluciones_devolucion_change', args=[obj.id])
            )
        elif obj.estado == 'APROBADA':
            return format_html(
                '<a class="button" href="{}?estado=EN_PROCESO" style="background-color: #17a2b8; color: white; padding: 5px 10px; border-radius: 4px;">Iniciar Proceso</a>',
                reverse('admin:devoluciones_devolucion_change', args=[obj.id])
            )
        elif obj.estado == 'EN_PROCESO':
            return format_html(
                '<a class="button" href="{}?estado=COMPLETADA" style="background-color: #6c757d; color: white; padding: 5px 10px; border-radius: 4px;">Marcar como Completada</a>',
                reverse('admin:devoluciones_devolucion_change', args=[obj.id])
            )
        return ""
    acciones.short_description = 'Acciones'
    acciones.allow_tags = True
    
    def save_model(self, request, obj, form, change):
        if change and 'estado' in request.GET:
            nuevo_estado = request.GET['estado']
            if nuevo_estado != obj.estado:
                # Registrar el cambio de estado en el historial
                HistorialEstadoDevolucion.objects.create(
                    devolucion=obj,
                    estado_anterior=obj.estado,
                    estado_nuevo=nuevo_estado,
                    usuario=request.user,
                    notas=f'Cambio de estado realizado desde el panel de administración'
                )
                obj.estado = nuevo_estado
                if nuevo_estado in ['APROBADA', 'RECHAZADA', 'COMPLETADA']:
                    obj.fecha_resolucion = timezone.now()
        
        super().save_model(request, obj, form, change)

@admin.register(DocumentoDevolucion)
class DocumentoDevolucionAdmin(admin.ModelAdmin):
    list_display = ('id', 'devolucion_link', 'descripcion', 'fecha_creacion_formateada', 'vista_previa')
    list_filter = ('fecha_creacion',)
    search_fields = ('devolucion__id', 'descripcion')
    readonly_fields = ('fecha_creacion', 'vista_previa')
    
    def devolucion_link(self, obj):
        url = reverse('admin:devoluciones_devolucion_change', args=[obj.devolucion.id])
        return mark_safe(f'<a href="{url}">Devolución #{obj.devolucion.id}</a>')
    devolucion_link.short_description = 'Devolución'
    devolucion_link.admin_order_field = 'devolucion__id'
    
    def fecha_creacion_formateada(self, obj):
        return obj.fecha_creacion.astimezone(timezone.get_current_timezone()).strftime('%d/%m/%Y %H:%M')
    fecha_creacion_formateada.short_description = 'Fecha de Creación'
    fecha_creacion_formateada.admin_order_field = 'fecha_creacion'
    
    def vista_previa(self, obj):
        if obj.archivo:
            if obj.archivo.name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                return format_html(
                    '<a href="{}" target="_blank">' 
                    '<img src="{}" style="max-height: 100px;" />' 
                    '</a>',
                    obj.archivo.url, obj.archivo.url
                )
            return format_html(
                '<a href="{}" target="_blank">Ver documento</a>',
                obj.archivo.url
            )
        return "Sin archivo"
    vista_previa.short_description = 'Vista previa'
    vista_previa.allow_tags = True

# No es necesario registrar HistorialEstadoDevolucion directamente
# ya que se maneja a través del inline en DevolucionAdmin
