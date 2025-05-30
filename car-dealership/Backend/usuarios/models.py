from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True, default='')
    fecha_nacimiento = models.DateField(null=True, blank=True)
    es_cliente = models.BooleanField(default=True)
    es_empleado = models.BooleanField(default=False)
    es_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        if not self.telefono:
            self.telefono = ''
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def get_full_name(self):
        """
        Devuelve el nombre completo del usuario.
        """
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.email
        
    def get_short_name(self):
        """
        Devuelve el nombre corto del usuario (solo el primer nombre).
        """
        return self.first_name or self.email.split('@')[0]
        
    def __str__(self):
        return self.get_full_name() or self.email

class Perfil(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name='perfil'
    )
    direccion = models.TextField(blank=True, null=True, default='Sin dirección registrada')
    foto_perfil = models.ImageField(
        upload_to='perfiles/', 
        blank=True, 
        null=True,
        default='perfiles/default_profile.png'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.usuario.username

class Cliente(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name='cliente'
    )
    preferencias = models.TextField(blank=True, null=True, default='Sin preferencias registradas')
    historial_compras = models.JSONField(default=list)
    puntos_fidelidad = models.IntegerField(default=0)

    def __str__(self):
        return self.usuario.username

class Empleado(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name='empleado'
    )
    cargo = models.CharField(max_length=100, default='Empleado General')
    fecha_contratacion = models.DateField(null=True, blank=True)
    especialidad = models.CharField(max_length=200, blank=True, null=True, default='Sin especialidad registrada')

    def save(self, *args, **kwargs):
        if not self.fecha_contratacion:
            self.fecha_contratacion = None
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.usuario.username} - {self.cargo}"
