Examen 2 - Teoría
Jaime Orlando López Ramos

¿Qué es la jerarquía de transformaciones? Menciona un ejemplo de esto en una escena
de ThreeJS.
R.- La jerarquía de transformación en THREE.js especifica en qué contexto pertenece cada objeto. Un ejemplo muy bueno es una aplicación del espacio donde tiene que haber satélites que orbiten otros objetos.
En este contexto, el objeto padre tiene una rotación individual, pero al tener uno o varios hijos, estos heredan el movimiento del padre, lo que se traduce en que estos tengan un movimiento rotatorio en el mismo 
sentido que el establecido en el padre. Independiente a este movimiento heredado, el objeto hijo aun puede puede tener una rotación individual que no afectará al padre, ya que solo los cambios del padre afectan al hijo y
no al revés.

¿Cuál es la diferencia entre el color difuso y el color especular en un material? ¿Qué
shader tiene implementados ambos colores en ThreeJS?
R.-La especularidad se refiere a la intensidad del brillo, mientras el color difuso se refiere al color principal que se incorporará al Mesh. El Shader que contiene ambas implementaciones es 'phong'

Menciona dos maneras para agregar efectos de relieve a objetos 3d. Describe de
manera general la diferencia entre ellas.
R.- Las 2 maneras en las que se puede agregar un relieve a un Mesh son aplicando normal maps o bump maps. La diferencia genera es que el normal map es un poco más detallado, ya que guarda la orientación del pixel en vez de la intensidad 
como en el bump map.

Describe qué contiene un archivo *.obj. Además, menciona qué significa cada una de
las posibles letras que aparecen en el archivo.
R.- Un archivo obj es un documento de texto que contiene la representación de una geometría. Un archivo obj contiene la posición de los vértices de dicha geomaetría.
Letras:
v - indica que esa línea representa un vértice
vp - indica que se representarán los puntos de una curvatura o una superficie.
f - Identifica los elementos/vértices de una cara de un Objeto. Es seguido por listas de vértices.
l - Identifica los vértices de elementos compuestos por múltiples líneas


¿Qué es un raycast, y para qué sirve?
R.- Un Raycast es un objeto que emite rayos en la dirección en la que se realizó un click en pantalla. El Raycast nos permite recuperar objetos que hayan colisionado con el rayo emitido.
En general, su uso es para detección de colisiones.

