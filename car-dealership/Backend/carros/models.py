from django.db import models

# Create your models here.

class Carro(models.Model):
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    año = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    kilometraje = models.IntegerField(default=0)
    transmision = models.CharField(
        max_length=50, 
        choices=[
            ('manual', 'Manual'),
            ('automatica', 'Automática'),
            ('semiautomatica', 'Semiautomática')
        ],
        default='manual'
    )
    combustible = models.CharField(
        max_length=50, 
        choices=[
            ('gasolina', 'Gasolina'),
            ('diesel', 'Diesel'),
            ('electrico', 'Eléctrico'),
            ('hibrido', 'Híbrido')
        ],
        default='gasolina'
    )
    estado = models.CharField(
        max_length=50, 
        choices=[
            ('nuevo', 'Nuevo'),
            ('usado', 'Usado'),
            ('recondicionado', 'Recondicionado')
        ],
        default='usado'
    )
    descripcion = models.TextField(blank=True, null=True)
    imagen_principal = models.ImageField(
        upload_to='carros/',
        blank=True, 
        null=True,
        default='carros/default_car.png'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Validaciones suaves antes de guardar
        if not self.descripcion:
            self.descripcion = f"Carro {self.marca} {self.modelo} del año {self.año}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.marca} {self.modelo} {self.año}"
