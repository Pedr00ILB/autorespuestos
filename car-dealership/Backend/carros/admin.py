from django.contrib import admin
from .models import Carro
from django.utils.html import format_html

class CarroAdmin(admin.ModelAdmin):
    list_display = ('marca', 'modelo', 'año', 'precio', 'precio_formateado', 'estado', 'imagen_miniatura')
    list_filter = ('marca', 'año', 'transmision', 'combustible', 'estado')
    search_fields = ('marca', 'modelo', 'descripcion')
    list_editable = ('precio', 'estado')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion', 'imagen_preview')
    fieldsets = (
        ('Información Básica', {
            'fields': ('marca', 'modelo', 'año', 'precio', 'kilometraje', 'estado')
        }),
        ('Especificaciones', {
            'fields': ('transmision', 'combustible')
        }),
        ('Detalles', {
            'fields': ('descripcion', 'imagen_principal', 'imagen_preview')
        }),
        ('Fechas', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    
    def precio_formateado(self, obj):
        return f"${obj.precio:,.2f}"
    precio_formateado.short_description = 'Precio'
    precio_formateado.admin_order_field = 'precio'
    
    def imagen_miniatura(self, obj):
        if obj.imagen_principal:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 100px;" />',
                obj.imagen_principal.url
            )
        return "Sin imagen"
    imagen_miniatura.short_description = 'Imagen'
    
    def imagen_preview(self, obj):
        if obj.imagen_principal:
            return format_html(
                '<img src="{}" style="max-height: 300px; max-width: 100%;" />',
                obj.imagen_principal.url
            )
        return "Sin imagen"
    imagen_preview.short_description = 'Vista previa de la imagen'
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Cuando se está editando un objeto existente
            return self.readonly_fields + ('fecha_creacion',)
        return self.readonly_fields

admin.site.register(Carro, CarroAdmin)
