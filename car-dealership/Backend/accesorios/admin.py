from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import Categoria, Accesorio

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'imagen_miniatura', 'cantidad_accesorios')
    search_fields = ('nombre', 'descripcion')
    readonly_fields = ('imagen_preview',)
    
    def imagen_miniatura(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" style="max-height: 50px;" />', obj.imagen.url)
        return "Sin imagen"
    imagen_miniatura.short_description = 'Imagen'
    imagen_miniatura.allow_tags = True
    
    def imagen_preview(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" style="max-width: 300px; max-height: 300px;" />', obj.imagen.url)
        return "Sin imagen"
    imagen_preview.short_description = 'Vista previa de la imagen'
    imagen_preview.allow_tags = True
    
    def cantidad_accesorios(self, obj):
        return obj.accesorio_set.count()
    cantidad_accesorios.short_description = 'N° de Accesorios'

@admin.register(Accesorio)
class AccesorioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio_formateado', 'stock', 'disponible', 'imagen_miniatura')
    list_filter = ('categoria', 'fecha_creacion')
    search_fields = ('nombre', 'descripcion', 'categoria__nombre')
    list_editable = ('stock',)
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion', 'imagen_preview')
    fieldsets = (
        (None, {
            'fields': ('categoria', 'nombre', 'descripcion')
        }),
        ('Precio y Stock', {
            'fields': ('precio', 'stock')
        }),
        ('Imágenes', {
            'fields': ('imagen', 'imagen_preview')
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
    
    def disponible(self, obj):
        return obj.stock > 0
    disponible.boolean = True
    disponible.short_description = 'Disponible'
    
    def imagen_miniatura(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px; object-fit: cover;" />', obj.imagen.url)
        return "Sin imagen"
    imagen_miniatura.short_description = 'Imagen'
    imagen_miniatura.allow_tags = True
    
    def imagen_preview(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" style="max-width: 300px; max-height: 300px;" />', obj.imagen.url)
        return "Sin imagen"
    imagen_preview.short_description = 'Vista previa de la imagen'
    imagen_preview.allow_tags = True
    
    def save_model(self, request, obj, form, change):
        # Aquí puedes agregar lógica adicional antes de guardar el modelo
        super().save_model(request, obj, form, change)
