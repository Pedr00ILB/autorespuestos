from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import CategoriaPieza, Pieza, ComentarioPieza

@admin.register(CategoriaPieza)
class CategoriaPiezaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'cantidad_piezas', 'imagen_miniatura')
    search_fields = ('nombre', 'descripcion')
    readonly_fields = ('imagen_preview',)
    
    def cantidad_piezas(self, obj):
        return obj.pieza_set.count()
    cantidad_piezas.short_description = 'N° de Piezas'
    
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

class ComentarioPiezaInline(admin.TabularInline):
    model = ComentarioPieza
    extra = 0
    readonly_fields = ('fecha_creacion', 'usuario', 'contenido', 'calificacion')
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Pieza)
class PiezaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio_formateado', 'stock', 'disponible', 'imagen_miniatura')
    list_filter = ('categoria', 'fecha_creacion')
    search_fields = ('nombre', 'descripcion', 'compatibilidad', 'categoria__nombre')
    list_editable = ('stock',)
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion', 'imagen_preview')
    inlines = [ComentarioPiezaInline]
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'categoria', 'descripcion')
        }),
        ('Precio y Stock', {
            'fields': ('precio', 'stock', 'garantia')
        }),
        ('Imágenes', {
            'fields': ('imagen', 'imagen_preview')
        }),
        ('Información Adicional', {
            'fields': ('compatibilidad',),
            'classes': ('collapse',)
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
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 50px; object-fit: cover;" />', 
                obj.imagen.url
            )
        return "Sin imagen"
    imagen_miniatura.short_description = 'Imagen'
    imagen_miniatura.allow_tags = True
    
    def imagen_preview(self, obj):
        if obj.imagen:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px;" />', 
                obj.imagen.url
            )
        return "Sin imagen"
    imagen_preview.short_description = 'Vista previa de la imagen'
    imagen_preview.allow_tags = True
    
    def save_model(self, request, obj, form, change):
        # Aquí puedes agregar lógica adicional antes de guardar el modelo
        super().save_model(request, obj, form, change)

@admin.register(ComentarioPieza)
class ComentarioPiezaAdmin(admin.ModelAdmin):
    list_display = ('pieza', 'usuario', 'calificacion_estrellas', 'fecha_creacion_formateada')
    list_filter = ('calificacion', 'fecha_creacion')
    search_fields = ('pieza__nombre', 'usuario__username', 'contenido')
    readonly_fields = ('fecha_creacion',)
    
    def calificacion_estrellas(self, obj):
        return '★' * obj.calificacion + '☆' * (5 - obj.calificacion)
    calificacion_estrellas.short_description = 'Calificación'
    calificacion_estrellas.admin_order_field = 'calificacion'
    
    def fecha_creacion_formateada(self, obj):
        return obj.fecha_creacion.strftime('%d/%m/%Y %H:%M')
    fecha_creacion_formateada.short_description = 'Fecha de Creación'
    fecha_creacion_formateada.admin_order_field = 'fecha_creacion'
