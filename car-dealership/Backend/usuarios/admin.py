from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import Usuario, Perfil, Cliente, Empleado

class PerfilInline(admin.StackedInline):
    model = Perfil
    can_delete = False
    verbose_name_plural = 'Perfil'
    fk_name = 'usuario'

class ClienteInline(admin.StackedInline):
    model = Cliente
    can_delete = False
    verbose_name_plural = 'Cliente'
    fk_name = 'usuario'

class EmpleadoInline(admin.StackedInline):
    model = Empleado
    can_delete = False
    verbose_name_plural = 'Empleado'
    fk_name = 'usuario'

class UsuarioAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff', 'es_cliente', 'es_empleado', 'es_admin')
    list_filter = ('is_staff', 'is_superuser', 'es_cliente', 'es_empleado', 'es_admin')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Información personal'), {'fields': ('username', 'first_name', 'last_name', 'telefono', 'fecha_nacimiento')}),
        (_('Permisos'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Roles personalizados'), {'fields': ('es_cliente', 'es_empleado', 'es_admin')}),
        (_('Fechas importantes'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    
    inlines = [PerfilInline, ClienteInline, EmpleadoInline]

# Registrar los modelos
admin.site.register(Usuario, UsuarioAdmin)

@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'fecha_creacion', 'fecha_actualizacion')
    search_fields = ('usuario__email', 'usuario__username')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
    list_select_related = ('usuario',)  # Optimiza consultas relacionadas con usuario

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'puntos_fidelidad')
    search_fields = ('usuario__email', 'usuario__username')
    list_select_related = ('usuario',)  # Optimiza consultas relacionadas con usuario

@admin.register(Empleado)
class EmpleadoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'cargo', 'fecha_contratacion')
    search_fields = ('usuario__email', 'usuario__username', 'cargo')
    list_filter = ('cargo', 'fecha_contratacion')
    list_select_related = ('usuario',)  # Optimiza consultas relacionadas con usuario
