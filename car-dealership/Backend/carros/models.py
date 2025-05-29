from django.db import models

# Create your models here.

class Carro(models.Model):
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    año = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    kilometraje = models.IntegerField()
    transmision = models.CharField(max_length=50, choices=[
        ('manual', 'Manual'),
        ('automatica', 'Automática'),
        ('semiautomatica', 'Semiautomática')
    ])
    combustible = models.CharField(max_length=50, choices=[
        ('gasolina', 'Gasolina'),
        ('diesel', 'Diesel'),
        ('electrico', 'Eléctrico'),
        ('hibrido', 'Híbrido')
    ])
    estado = models.CharField(max_length=50, choices=[
        ('nuevo', 'Nuevo'),
        ('usado', 'Usado'),
        ('recondicionado', 'Recondicionado')
    ])
    descripcion = models.TextField()
    imagen_principal = models.ImageField(upload_to='carros/')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.marca} {self.modelo} {self.año}"
