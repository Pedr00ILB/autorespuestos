from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permiso personalizado que permite que solo el propietario o un administrador
    pueda editar o eliminar un carro.
    """
    
    def has_object_permission(self, request, view, obj):
        # Solo permitir acceso si es el propietario o un administrador
        return obj.creado_por == request.user or request.user.is_staff
