from django.db import models

# Create your models here.

class SBAMetrics(models.Model):
    borr_zip = models.CharField(max_length=5, unique=True)
    # sba_per_small_bus = models.NumericField()

    def __str__(self):
        return self.borr_zip
