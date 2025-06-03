from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _
from .models import TipoAsesoria, Asesoria

@admin.register(TipoAsesoria)
class TipoAsesoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'precio_formateado', 'duracion_estimada_formateada')
    search_fields = ('nombre', 'descripcion')
    list_editable = ('precio',)
    
    def precio_formateado(self, obj):
        if obj.precio is not None:
            return f"${obj.precio:,.2f}"
        return "A consultar"
    precio_formateado.short_description = 'Precio'
    precio_formateado.admin_order_field = 'precio'
    
    def duracion_estimada_formateada(self, obj):
        # Convertir segundos a horas, minutos, segundos
        total_seconds = obj.duracion_estimada.total_seconds()
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        seconds = int(total_seconds % 60)
        
        parts = []
        if hours > 0:
            parts.append(f"{hours} hora{'s' if hours > 1 else ''}")
        if minutes > 0:
            parts.append(f"{minutes} minuto{'s' if minutes > 1 else ''}")
        if seconds > 0 and not parts:  # Solo mostrar segundos si no hay horas ni minutos
            parts.append(f"{seconds} segundo{'s' if seconds > 1 else ''}")
            
        return ' '.join(parts) if parts else "0 segundos"
    duracion_estimada_formateada.short_description = 'Duración Estimada'
    duracion_estimada_formateada.admin_order_field = 'duracion_estimada'

@admin.register(Asesoria)
class AsesoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'tipo_asesoria', 'estado_badge', 'fecha_solicitud_formateada', 'acciones')
    list_filter = ('estado', 'tipo_asesoria', 'fecha_solicitud')
    search_fields = ('cliente__usuario__username', 'cliente__usuario__email', 'tipo_asesoria__nombre')
    list_select_related = ('cliente__usuario', 'tipo_asesoria', 'asesor__usuario')
    readonly_fields = ('fecha_solicitud', 'duracion_real', 'estado_actual', 'historial_estados')
    fieldsets = (
        ('Información General', {
            'fields': ('cliente', 'tipo_asesoria', 'asesor', 'estado')
        }),
        ('Fechas y Horarios', {
            'fields': ('fecha_solicitud', 'fecha_programada', 'fecha_inicio', 'fecha_fin', 'duracion_real')
        }),
        ('Detalles', {
            'fields': ('descripcion', 'notas', 'resultados')
        }),
        ('Historial', {
            'fields': ('estado_actual', 'historial_estados'),
            'classes': ('collapse',)
        }),
    )
    
    def estado_badge(self, obj):
        estado_classes = {
            'PENDIENTE': 'badge badge-warning',
            'PROGRAMADA': 'badge badge-info',
            'EN_PROCESO': 'badge badge-primary',
            'COMPLETADA': 'badge badge-success',
            'CANCELADA': 'badge badge-danger',
        }
        return format_html(
            '<span class="{}">{}</span>',
            estado_classes.get(obj.estado, 'badge badge-secondary'),
            obj.get_estado_display()
        )
    estado_badge.short_description = 'Estado'
    estado_badge.admin_order_field = 'estado'
    estado_badge.allow_tags = True
    
    def fecha_solicitud_formateada(self, obj):
        return obj.fecha_solicitud.astimezone(timezone.get_current_timezone()).strftime('%d/%m/%Y %H:%M')
    fecha_solicitud_formateada.short_description = 'Fecha de Solicitud'
    fecha_solicitud_formateada.admin_order_field = 'fecha_solicitud'
    
    def estado_actual(self, obj):
        return self.estado_badge(obj)
    estado_actual.short_description = 'Estado Actual'
    estado_actual.allow_tags = True
    
    def historial_estados(self, obj):
        # Aquí iría la lógica para mostrar el historial de cambios de estado
        # Similar a como se implementó en el modelo de reparaciones
        return "Historial de cambios de estado"
    historial_estados.short_description = 'Historial de Estados'
    historial_estados.allow_tags = True
    
    def acciones(self, obj):
        if obj.estado == 'PENDIENTE':
            return format_html(
                '<a class="button" href="{}?estado=PROGRAMADA">Programar</a>',
                reverse('admin:asesorias_asesoria_change', args=[obj.id])
            )
        elif obj.estado == 'PROGRAMADA':
            return format_html(
                '<a class="button" href="{}?estado=EN_PROCESO">Iniciar</a>',
                reverse('admin:asesorias_asesoria_change', args=[obj.id])
            )
        return ""
    acciones.short_description = 'Acciones'
    acciones.allow_tags = True
    
    def save_model(self, request, obj, form, change):
        # Lógica para manejar cambios de estado y cálculo de duración
        if 'estado' in request.GET:
            nuevo_estado = request.GET['estado']
            if nuevo_estado != obj.estado:
                # Registrar el cambio de estado en el historial
                obj.estado = nuevo_estado
                if nuevo_estado == 'EN_PROCESO':
                    obj.fecha_inicio = timezone.now()
                elif nuevo_estado in ['COMPLETADA', 'CANCELADA']:
                    obj.fecha_fin = timezone.now()
                    if obj.fecha_inicio:
                        obj.duracion_real = obj.fecha_fin - obj.fecha_inicio
        
        super().save_model(request, obj, form, change)
