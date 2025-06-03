"""
Script para inicializar datos básicos del sistema.
Incluye la creación de grupos y asignación de permisos.
"""

def crear_grupos_y_permisos():
    from django.contrib.auth.models import Group, Permission
    from django.contrib.contenttypes.models import ContentType
    from django.apps import apps
    
    # Obtener todos los modelos de la aplicación
    models = apps.get_models()
    
    # Permisos base para cada modelo
    model_permissions = {
        'view': 'Ver {model_name}',
        'add': 'Agregar {model_name}',
        'change': 'Cambiar {model_name}',
        'delete': 'Eliminar {model_name}'
    }
    
    # Crear grupos
    admin_group, created = Group.objects.get_or_create(name='Administrador')
    empleado_group, created = Group.objects.get_or_create(name='Empleado')
    cliente_group, created = Group.objects.get_or_create(name='Cliente')
    
    # Asignar todos los permisos al grupo Administrador
    admin_permissions = Permission.objects.all()
    admin_group.permissions.set(admin_permissions)
    
    # Permisos para Empleado
    empleado_permissions = []
    for model in models:
        app_label = model._meta.app_label
        model_name = model._meta.model_name
        
        # Agregar permisos de vista para todos los modelos
        for codename, name in model_permissions.items():
            perm_codename = f'{codename}_{model_name}'
            try:
                perm = Permission.objects.get(codename=perm_codename, content_type__app_label=app_label)
                # Empleados pueden ver y modificar, pero no eliminar
                if codename != 'delete':
                    empleado_permissions.append(perm)
            except Permission.DoesNotExist:
                continue
    
    # Asignar permisos al grupo Empleado
    empleado_group.permissions.set(empleado_permissions)
    
    # Permisos para Cliente (solo ver su perfil y crear solicitudes)
    cliente_permissions = [
        Permission.objects.get(codename='view_usuario'),
        Permission.objects.get(codename='change_usuario'),
        Permission.objects.get(codename='view_perfil'),
        Permission.objects.get(codename='change_perfil'),
        Permission.objects.get(codename='add_asesoria'),
        Permission.objects.get(codename='view_asesoria'),
    ]
    cliente_group.permissions.set(cliente_permissions)
    
    print("Grupos y permisos configurados exitosamente!")

if __name__ == "__main__":
    import os
    import django
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'car_dealership.settings')
    django.setup()
    
    crear_grupos_y_permisos()
