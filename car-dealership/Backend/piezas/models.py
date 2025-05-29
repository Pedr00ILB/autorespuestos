from django.db import models
from django.utils.translation import gettext_lazy as _

class CategoriaPieza(models.Model):
    nombre = models.CharField(_('Nombre'), max_length=100)
    descripcion = models.TextField(_('Descripción'), blank=True, null=True)
    imagen = models.ImageField(_('Imagen'), upload_to='categorias_piezas/', blank=True, null=True)

    class Meta:
        verbose_name = _('Categoría de Pieza')
        verbose_name_plural = _('Categorías de Piezas')

    def __str__(self):
        return self.nombre

class Pieza(models.Model):
    nombre = models.CharField(_('Nombre'), max_length=200)
    descripcion = models.TextField(_('Descripción'))
    precio = models.DecimalField(_('Precio'), max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(_('Stock'))
    imagen = models.ImageField(_('Imagen'), upload_to='piezas/')
    categoria = models.ForeignKey(
        CategoriaPieza,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name=_('Categoría')
    )
    compatibilidad = models.TextField(_('Compatibilidad con Modelos'), blank=True, null=True)
    garantia = models.IntegerField(_('Garantía (meses)'))
    fecha_creacion = models.DateTimeField(_('Fecha de Creación'), auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(_('Fecha de Actualización'), auto_now=True)

    class Meta:
        verbose_name = _('Pieza')
        verbose_name_plural = _('Piezas')
        ordering = ['-fecha_creacion']

    def __str__(self):
        return self.nombre

class ComentarioPieza(models.Model):
    pieza = models.ForeignKey(
        Pieza,
        on_delete=models.CASCADE,
        related_name='comentarios'
    )
    usuario = models.ForeignKey(
        'usuarios.Usuario',
        on_delete=models.CASCADE,
        related_name='comentarios_piezas'
    )
    contenido = models.TextField(_('Contenido'))
    calificacion = models.PositiveIntegerField(_('Calificación'), default=0)
    fecha_creacion = models.DateTimeField(_('Fecha de Creación'), auto_now_add=True)

    class Meta:
        verbose_name = _('Comentario de Pieza')
        verbose_name_plural = _('Comentarios de Piezas')
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Comentario de {self.usuario.username} sobre {self.pieza.nombre}"
