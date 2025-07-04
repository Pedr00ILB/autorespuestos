# Generated by Django 5.2.1 on 2025-05-29 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Carro',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('marca', models.CharField(max_length=100)),
                ('modelo', models.CharField(max_length=100)),
                ('año', models.IntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('kilometraje', models.IntegerField()),
                ('transmision', models.CharField(choices=[('manual', 'Manual'), ('automatica', 'Automática'), ('semiautomatica', 'Semiautomática')], max_length=50)),
                ('combustible', models.CharField(choices=[('gasolina', 'Gasolina'), ('diesel', 'Diesel'), ('electrico', 'Eléctrico'), ('hibrido', 'Híbrido')], max_length=50)),
                ('estado', models.CharField(choices=[('nuevo', 'Nuevo'), ('usado', 'Usado'), ('recondicionado', 'Recondicionado')], max_length=50)),
                ('descripcion', models.TextField()),
                ('imagen_principal', models.ImageField(upload_to='carros/')),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
