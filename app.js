'use strict'
// params  @a, @b => Objetos que contiene X, Y cada uno
// return Promise(int) => con la distancia entre los puntos
async function calcularDistanciaEntrePuntos( a, b ){
  return new Promise( resolve =>{
    resolve( Math.pow( (Math.pow( (a.x - b.x), 2 ) + Math.pow( (a.y - b.y), 2 )), 0.5) )
  })
}

// params @array => contiene una arreglo de todos los puntos
// [ { x, y }, { x, y } ... { x, y } ]
// params @result => es una variable booleana para pasar el resultado de las iteraciones
// return Promise(boolean)
async function evalRepetidos( array, result ){
  var _result = typeof result !== 'undefined' ?  result : true
  if( array.length > 1 ){
    var comp = array[0]
    var arrayX = array.slice(1)
     arrayX.forEach( async (item) => {
      if( comp.x == item.x && comp.y == item.y ) _result = false
    })
    const r = await evalRepetidos( arrayX, _result )
    return new Promise( resolve => {
      resolve( r )
    })
  }else{
    return _result
  }
}

// params @array => contiene una arreglo de todos los puntos
// [ { x, y }, { x, y } ... { x, y } ]
// return Promise(boolean)
async function evalManecillasReloj( array ){
  var response = true
  array.forEach( async (item, index) =>{
    if( index > 0 ){
      if( (item.x < array[ index - 1 ].x && item.y < array[ index - 1 ].y) ) response = false
    }
  })
  return new Promise( resolve => {
    resolve( response )
  })
}

// params @n  => número de puntos dados
// return Promise(boolean)
function evalSegmentoN( n ){
  return (n >= 3 && n <= 1000)
}

// params @n  => número de puntos dados
// return Promise(boolean)
function evalNContraArray( n, array ){
  return (n === array.length)
}
// params @array => contiene una arreglo de todos los puntos
// [ { x, y }, { x, y } ... { x, y } ]
// return Promise(boolean)
async function evalSegmentoXY( array ){
  var response = true
  array.forEach( async item => {
    if( item.x < 0 ||  item.x > 1000 || item.y < 0 ||  item.y > 1000  ) response =  false
  })
  return new Promise( resolve => {
    resolve( response )
  })
}

// params @array => contiene una arreglo de todos los puntos
// [ { x, y }, { x, y } ... { x, y } ]
// params @n  => número de puntos dados
// return Promise( suma total o Error )
async function ejecucion( n, array ){
  var sum = 0
  var errorMess = ''
  if( !evalSegmentoN(n) ) errorMess =  "Su N está fuera de rango"
  if( !evalNContraArray(n,array) ) errorMess =  "Su N no concuerda con los datos enviados"

  await evalSegmentoXY( array )
  .then( res =>{
    if( !res ){
      errorMess =  "Alguno de sus puntos no se enecuntra en rango"
    }
  })

  await evalManecillasReloj( array )
  .then( res => {
    if( !res ){
      errorMess = "No van en orden sus puntos"
    }
  })

  await evalRepetidos( array )
  .then( res =>{
    if( !res ){
      errorMess = "Algunos elementos están repetidos"
    }
  })
  if( errorMess == ''){
    for (var i = 0; i < array.length -1; i++) {
      sum += await calcularDistanciaEntrePuntos( array[i], array[i+1] )
    }
    sum += await calcularDistanciaEntrePuntos( array[array.length -2], array[ array.length -1] )
  }

  return new Promise( (resolve, reject)=>{
    if( errorMess != '' )
      reject( errorMess )
    else
      resolve( sum )
  })
}

// Ejecución =>
// Puntos : Array<{x, y}>
// n : int || float
// Tienen que estar ordenados por las maneceillas del reloj
// en cada iteración un número ( x o y ) tiene que ser mayor a su par anterior
// { x : 10, y: 20 } contra { x : 20, y : 20 } [ OK ]
// { x : 10, y: 20 } contra { x : 10, y : 10 } [ ERROR ]
// { x : 40, y: 50 } contra { x : 10, y : 10 } [ ERROR ]

// Ejemplo propuesto en la actividad, pero ordenado
var puntos = [
  { x: 40, y: 20 },
  { x: 20, y: 40 },
  { x: 40, y: 60 },
  { x: 60, y: 40 }
]

// N = longitud de puntos
var n = 4

ejecucion(n, puntos)
.then( res =>{
  // Aquí se controla cómo se muestra el resultado
  console.log( 'Su resultado es: ', res )
})
.catch( e =>{
  // Aquí se controla cómo se muestran los errores
  console.error( e )
})
