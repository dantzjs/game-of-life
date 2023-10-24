## Final Note

This repository is part of my beginnings in programming. The project is full of bad practices and potential bugs without clear readability management.

I have kept this project because it has sentimental value for me. Instead of renewing it I have decided to archive it as a memory

# Juego de la vida

El juego de la vida es un autómata celular diseñado por el matemático británico *John Horton Conway* en 1970.

Considerese el término *"Automáta Celular*" como un sistema dinámico que evoluciona en pasos discretos.

Las células tienen dos estados: están "vivas" o "muertas". Cada célula tiene 8 células "vecinas", que son las que están próximas a ella, incluidas las diagonales. El estado de las células evoluciona a lo largo del tiempo, podría decirse que por turnos. El estado de todas las células se tiene en cuenta para calcular el estado de las mismas al turno siguiente. Todas las células se actualizan simultáneamente, siguiendo estas reglas:

-   Una célula muerta con exactamente 3 células vecinas vivas nacerá al siguiente turno.
-   Una célula viva con 2 o 3 células vecinas vivas se mantendrá viva.
-   Una célula viva con 4 o más células vecinas vivas morirá por sobrepoblación.
-   Una célula viva con 1 o ninguna célula vecina viva morirá por soledad.

El juego de la vida suele ser un desafío de la programación para los aficionados.

  

## Agradecimientos

-   A mi profesora María Rivas, por darme las bases del lenguaje Javascript.
-   A Jesús Sanchez, ([@frakcool](https://github.com/Frakcool)) por proponerme éste desafío.
-   A Cruz Deffit, por salvarme del vaso de agua en el que me ahogaba.
-   A mis dedos, porque siempre puedo contar con ellos.

#### Autor: José D. Gutiérrez

By [@jupitense](https://github.com/jupitense)
