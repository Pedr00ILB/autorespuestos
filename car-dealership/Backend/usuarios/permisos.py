from rest_framework import permissions

class EsCliente(permissions.BasePermission):
    """
    Permiso personalizado que solo permite el acceso a usuarios con el rol de cliente.
    """
    def has_permission(self, request, view):
        # Verifica si el usuario está autenticado y es un cliente
        return bool(request.user and request.user.is_authenticated and request.user.es_cliente)

class EsEmpleado(permissions.BasePermission):
    """
    Permiso personalizado que solo permite el acceso a usuarios con el rol de empleado.
    """
    def has_permission(self, request, view):
        # Verifica si el usuario está autenticado y es un empleado
        return bool(request.user and request.user.is_authenticated and request.user.es_empleado)

class EsAdmin(permissions.BasePermission):
    """
    Permiso personalizado que solo permite el acceso a usuarios con el rol de administrador.
    """
    def has_permission(self, request, view):
        # Verifica si el usuario está autenticado y es un administrador
        return bool(request.user and request.user.is_authenticated and request.user.es_admin)
