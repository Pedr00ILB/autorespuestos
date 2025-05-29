from django.db import models
from django.utils.translation import gettext_lazy as _

class Categoria(models.Model):
    nombre = models.CharField(_('Nombre'), max_length=100)
    descripcion = models.TextField(_('Descripción'), blank=True, null=True)
    imagen = models.ImageField(_('Imagen'), upload_to='categorias/', blank=True, null=True)

    class Meta:
        verbose_name = _('Categoría')
        verbose_name_plural = _('Categorías')
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Accesorio(models.Model):
    categoria = models.ForeignKey(
        'Categoria',
        on_delete=models.CASCADE,
        verbose_name=_('Categoría')
    )
    nombre = models.CharField(_('Nombre'), max_length=200)
    descripcion = models.TextField(_('Descripción'))
    precio = models.DecimalField(_('Precio'), max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(_('Stock'))
    imagen = models.ImageField(_('Imagen'), upload_to='accesorios/')
    fecha_creacion = models.DateTimeField(_('Fecha de Creación'), auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(_('Fecha de Actualización'), auto_now=True)

    class Meta:
        verbose_name = _('Accesorio')
        verbose_name_plural = _('Accesorios')
        ordering = ['-fecha_creacion']

    def __str__(self):
        return self.nombre
