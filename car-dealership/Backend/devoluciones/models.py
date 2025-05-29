from django.db import models
from django.utils.translation import gettext_lazy as _
from usuarios.models import Cliente
from piezas.models import Pieza
from carros.models import Carro

class Devolucion(models.Model):
    TIPOS_DEVOLUCION = [
        ('PRODUCTO', _('Producto')),
        ('VEHICULO', _('Vehículo')),
        ('SERVICIO', _('Servicio')),
    ]

    ESTADOS = [
        ('PENDIENTE', _('Pendiente')),
        ('APROBADA', _('Aprobada')),
        ('RECHAZADA', _('Rechazada')),
        ('EN_PROCESO', _('En Proceso')),
        ('COMPLETADA', _('Completada')),
    ]

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        verbose_name=_('Cliente')
    )
    tipo = models.CharField(_('Tipo'), max_length=20, choices=TIPOS_DEVOLUCION)
    motivo = models.TextField(_('Motivo'))
    estado = models.CharField(_('Estado'), max_length=20, choices=ESTADOS, default='PENDIENTE')
    fecha_solicitud = models.DateTimeField(_('Fecha de Solicitud'), auto_now_add=True)
    fecha_resolucion = models.DateTimeField(_('Fecha de Resolución'), null=True, blank=True)
    monto = models.DecimalField(_('Monto'), max_digits=10, decimal_places=2, null=True, blank=True)
    producto_devuelto = models.ForeignKey(
        Pieza,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Producto Devuelto')
    )
    vehiculo_devuelto = models.ForeignKey(
        Carro,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Vehículo Devuelto')
    )
    comentario = models.TextField(_('Comentario'), blank=True, null=True)

    class Meta:
        verbose_name = _('Devolución')
        verbose_name_plural = _('Devoluciones')
        ordering = ['-fecha_solicitud']

    def __str__(self):
        return f'Devolución #{self.id} - {self.get_tipo_display()} - {self.get_estado_display()}'

class HistorialEstadoDevolucion(models.Model):
    devolucion = models.ForeignKey(
        Devolucion,
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
        verbose_name = _('Historial de Estado de Devolución')
        verbose_name_plural = _('Historial de Estados de Devoluciones')
        ordering = ['-fecha_cambio']

    def __str__(self):
        return f'Cambio de estado en {self.devolucion} el {self.fecha_cambio}'

class DocumentoDevolucion(models.Model):
    devolucion = models.ForeignKey(
        Devolucion,
        on_delete=models.CASCADE,
        related_name='documentos'
    )
    archivo = models.FileField(_('Archivo'), upload_to='documentos_devoluciones/')
    descripcion = models.CharField(_('Descripción'), max_length=200)
    fecha_creacion = models.DateTimeField(_('Fecha de Creación'), auto_now_add=True)

    class Meta:
        verbose_name = _('Documento de Devolución')
        verbose_name_plural = _('Documentos de Devoluciones')
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f'Documento de {self.devolucion} - {self.descripcion}'
