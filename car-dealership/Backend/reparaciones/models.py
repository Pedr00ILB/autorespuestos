from django.db import models
from django.utils.translation import gettext_lazy as _
from carros.models import Carro
from usuarios.models import Cliente, Empleado

class Servicio(models.Model):
    nombre = models.CharField(_('Nombre'), max_length=100)
    descripcion = models.TextField(_('Descripción'))
    precio = models.DecimalField(_('Precio'), max_digits=10, decimal_places=2)
    duracion_estimada = models.DurationField(_('Duración Estimada'))
    imagen = models.ImageField(_('Imagen'), upload_to='servicios/', blank=True, null=True)
    fecha_creacion = models.DateTimeField(_('Fecha de Creación'), auto_now_add=True)

    class Meta:
        verbose_name = _('Servicio')
        verbose_name_plural = _('Servicios')
        ordering = ['-fecha_creacion']

    def __str__(self):
        return self.nombre

class Reparacion(models.Model):
    ESTADOS = [
        ('PENDIENTE', _('Pendiente')),
        ('EN_PROCESO', _('En Proceso')),
        ('COMPLETADO', _('Completado')),
        ('CANCELADO', _('Cancelado')),
    ]

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        verbose_name=_('Cliente')
    )
    vehiculo = models.ForeignKey(
        Carro,
        on_delete=models.CASCADE,
        verbose_name=_('Vehículo')
    )
    servicios = models.ManyToManyField(
        Servicio,
        through='DetalleReparacion',
        verbose_name=_('Servicios')
    )
    fecha_ingreso = models.DateTimeField(_('Fecha de Ingreso'), auto_now_add=True)
    fecha_entrega = models.DateTimeField(_('Fecha de Entrega'), null=True, blank=True)
    estado = models.CharField(_('Estado'), max_length=20, choices=ESTADOS, default='PENDIENTE')
    descripcion_problema = models.TextField(_('Descripción del Problema'))
    descripcion_solucion = models.TextField(_('Descripción de la Solución'), blank=True, null=True)
    costo_total = models.DecimalField(_('Costo Total'), max_digits=10, decimal_places=2, null=True, blank=True)
    tecnico_asignado = models.ForeignKey(
        Empleado,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Técnico Asignado')
    )

    class Meta:
        verbose_name = _('Reparación')
        verbose_name_plural = _('Reparaciones')
        ordering = ['-fecha_ingreso']

    def __str__(self):
        return f'Reparación #{self.id} - {self.vehiculo} - {self.get_estado_display()}'

class DetalleReparacion(models.Model):
    reparacion = models.ForeignKey(
        Reparacion,
        on_delete=models.CASCADE,
        verbose_name=_('Reparación')
    )
    servicio = models.ForeignKey(
        Servicio,
        on_delete=models.CASCADE,
        verbose_name=_('Servicio')
    )
    costo = models.DecimalField(_('Costo'), max_digits=10, decimal_places=2)
    fecha_ejecucion = models.DateTimeField(_('Fecha de Ejecución'), null=True, blank=True)
    notas = models.TextField(_('Notas'), blank=True, null=True)

    class Meta:
        verbose_name = _('Detalle de Reparación')
        verbose_name_plural = _('Detalles de Reparación')
        ordering = ['fecha_ejecucion']

    def __str__(self):
        return f'Detalle de {self.reparacion} - {self.servicio}'

class HistorialEstadoReparacion(models.Model):
    reparacion = models.ForeignKey(
        Reparacion,
        on_delete=models.CASCADE,
        related_name='historial_estados'
    )
    estado_anterior = models.CharField(_('Estado Anterior'), max_length=20)
    estado_nuevo = models.CharField(_('Estado Nuevo'), max_length=20)
    fecha_cambio = models.DateTimeField(_('Fecha de Cambio'), auto_now_add=True)
    usuario = models.ForeignKey(
        'usuarios.Usuario',
        on_delete=models.SET_NULL,
        null=True,
        verbose_name=_('Usuario')
    )
    notas = models.TextField(_('Notas'), blank=True, null=True)

    class Meta:
        verbose_name = _('Historial de Estado de Reparación')
        verbose_name_plural = _('Historial de Estados de Reparaciones')
        ordering = ['-fecha_cambio']

    def __str__(self):
        return f'Cambio de estado en {self.reparacion} el {self.fecha_cambio}'
