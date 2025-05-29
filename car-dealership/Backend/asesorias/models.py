from django.db import models
from django.utils.translation import gettext_lazy as _
from usuarios.models import Cliente, Empleado

class TipoAsesoria(models.Model):
    nombre = models.CharField(_('Nombre'), max_length=100)
    descripcion = models.TextField(_('Descripción'), blank=True, null=True)
    duracion_estimada = models.DurationField(_('Duración Estimada'))
    precio = models.DecimalField(_('Precio'), max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        verbose_name = _('Tipo de Asesoría')
        verbose_name_plural = _('Tipos de Asesorías')
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Asesoria(models.Model):
    ESTADOS = [
        ('PENDIENTE', _('Pendiente')),
        ('PROGRAMADA', _('Programada')),
        ('EN_PROCESO', _('En Proceso')),
        ('COMPLETADA', _('Completada')),
        ('CANCELADA', _('Cancelada')),
    ]

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        verbose_name=_('Cliente')
    )
    tipo_asesoria = models.ForeignKey(
        TipoAsesoria,
        on_delete=models.CASCADE,
        verbose_name=_('Tipo de Asesoría')
    )
    asesor = models.ForeignKey(
        Empleado,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Asesor')
    )
    estado = models.CharField(_('Estado'), max_length=20, choices=ESTADOS, default='PENDIENTE')
    fecha_solicitud = models.DateTimeField(_('Fecha de Solicitud'), auto_now_add=True)
    fecha_programada = models.DateTimeField(_('Fecha Programada'), null=True, blank=True)
    fecha_inicio = models.DateTimeField(_('Fecha de Inicio'), null=True, blank=True)
    fecha_fin = models.DateTimeField(_('Fecha de Fin'), null=True, blank=True)
    duracion_real = models.DurationField(_('Duración Real'), null=True, blank=True)
    descripcion = models.TextField(_('Descripción'))
    resultado = models.TextField(_('Resultado'), blank=True, null=True)
    calificacion = models.PositiveIntegerField(_('Calificación'), null=True, blank=True)
    comentarios = models.TextField(_('Comentarios'), blank=True, null=True)

    class Meta:
        verbose_name = _('Asesoría')
        verbose_name_plural = _('Asesorías')
        ordering = ['-fecha_solicitud']

    def __str__(self):
        return f'Asesoría #{self.id} - {self.get_estado_display()}'

