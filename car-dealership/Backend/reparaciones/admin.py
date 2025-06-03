from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Servicio, Reparacion, DetalleReparacion, HistorialEstadoReparacion

@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'duracion_estimada', 'imagen_miniatura')
    list_filter = ('precio',)
    search_fields = ('nombre', 'descripcion')
    readonly_fields = ('fecha_creacion', 'imagen_preview')
    
    def imagen_miniatura(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" style="max-height: 50px;" />', obj.imagen.url)
        return "Sin imagen"
    imagen_miniatura.short_description = 'Imagen'
    
    def imagen_preview(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" style="max-width: 300px; max-height: 300px;" />', obj.imagen.url)
        return "Sin imagen"
    imagen_preview.short_description = 'Vista previa'

class DetalleReparacionInline(admin.TabularInline):
    model = DetalleReparacion
    extra = 1
    readonly_fields = ('costo',)
    
    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        # Si se está creando una nueva reparación, no mostrar el campo de costo
        if not obj:
            formset.form.base_fields['costo'].widget.attrs['readonly'] = True
        return formset

class HistorialEstadoReparacionInline(admin.TabularInline):
    model = HistorialEstadoReparacion
    extra = 0
    readonly_fields = ('fecha_cambio', 'usuario', 'estado_anterior', 'estado_nuevo', 'notas')
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Reparacion)
class ReparacionAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'vehiculo', 'estado', 'fecha_ingreso', 'costo_total_formateado')
    list_filter = ('estado', 'fecha_ingreso', 'tecnico_asignado')
    search_fields = ('cliente__usuario__username', 'vehiculo__marca', 'vehiculo__modelo', 'descripcion_problema')
    readonly_fields = ('fecha_ingreso', 'costo_total', 'historial_estados')
    inlines = [DetalleReparacionInline, HistorialEstadoReparacionInline]
    
    fieldsets = (
        ('Información General', {
            'fields': ('cliente', 'vehiculo', 'tecnico_asignado', 'estado')
        }),
        ('Detalles', {
            'fields': ('descripcion_problema', 'descripcion_solucion', 'costo_total')
        }),
        ('Fechas', {
            'fields': ('fecha_ingreso', 'fecha_entrega'),
            'classes': ('collapse',)
        }),
    )
    
    def costo_total_formateado(self, obj):
        if obj.costo_total is not None:
            return f"${obj.costo_total:,.2f}"
        return "Pendiente"
    costo_total_formateado.short_description = 'Costo Total'
    
    def save_model(self, request, obj, form, change):
        if change and 'estado' in form.changed_data:
            # Registrar el cambio de estado en el historial
            HistorialEstadoReparacion.objects.create(
                reparacion=obj,
                estado_anterior=form.initial.get('estado', 'N/A'),
                estado_nuevo=obj.estado,
                usuario=request.user,
                notas=f'Cambio de estado realizado desde el panel de administración'
            )
        super().save_model(request, obj, form, change)
    
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

@admin.register(DetalleReparacion)
class DetalleReparacionAdmin(admin.ModelAdmin):
    list_display = ('reparacion', 'servicio', 'costo', 'fecha_ejecucion')
    list_filter = ('servicio', 'fecha_ejecucion')
    search_fields = ('reparacion__id', 'servicio__nombre', 'notas')
    readonly_fields = ('costo',)
    
    def save_model(self, request, obj, form, change):
        # Al guardar, establecer el costo desde el servicio si no se ha establecido
        if not obj.costo and obj.servicio:
            obj.costo = obj.servicio.precio
        super().save_model(request, obj, form, change)

@admin.register(HistorialEstadoReparacion)
class HistorialEstadoReparacionAdmin(admin.ModelAdmin):
    list_display = ('reparacion_link', 'estado_anterior', 'estado_nuevo', 'fecha_cambio', 'usuario')
    list_filter = ('estado_anterior', 'estado_nuevo')
    search_fields = ('reparacion__id', 'usuario__username', 'notas')
    readonly_fields = ('reparacion', 'estado_anterior', 'estado_nuevo', 'fecha_cambio', 'usuario', 'notas')
    
    def reparacion_link(self, obj):
        url = reverse('admin:reparaciones_reparacion_change', args=[obj.reparacion.id])
        return mark_safe(f'<a href="{url}">Reparación #{obj.reparacion.id}</a>')
    reparacion_link.short_description = 'Reparación'
    reparacion_link.admin_order_field = 'reparacion__id'
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
