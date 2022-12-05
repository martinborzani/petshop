const app = Vue.createApp({
    data() {
        return {
            allCards: [],
            backupCards: [],
            backupJuguetes: [],
            backupFarmacia: [],
            categorias: [],
            objetosJuguete: [],
            objetosFarmacia: [],
            urlApi: "https://apipetshop.herokuapp.com/api/articulos",
            detalles: [],
            id: (new URLSearchParams(location.search).get("id")),
            pocoStock: [],
            muchoStock: [],
            busqueda: "",
            carritoCompras: [],
            precioFinal: 0,
        }
    },
    created() { /* created es para  cuando el obejto, la aplicacion ya se creo se ejecuta estos metodos*/
        this.loadData(this.urlApi)
    },
    mounted() { /* es cuando se creo la parte visual cuando este renderizado */
        let local = JSON.parse(localStorage.getItem("produc"))
        if (local) {
            this.carritoCompras = local
        }
    },
    methods: { /* funciones q utilizamos normalmente */
        loadData(url) { //hacemos una peticion a la pagina web consumir los datos en tiempo real
            fetch(url).then(response => response.json() /* //devuelve promesa q se resuelve y response q es respuesta te lo convierte formato json para manipularlo */
                    .then(data => { /* data donde almaceno objetos literarios de vue */
                        this.allCards = data.response /* para entrar a una de sus propiedades uso la palabra reservada this*/
                        this.backupCards = this.allCards
                        this.stock = this.allCards.stock
                        this.objetosJuguete = this.allCards.filter(objetos => objetos.tipo == "Juguete");
                        this.objetosFarmacia = this.allCards.filter(objetos => objetos.tipo == "Medicamento");
                        this.backupJuguetes = this.objetosJuguete;
                        this.backupFarmacia = this.objetosFarmacia;
                        this.detalles = this.allCards.find(valor => valor._id == this.id);
                        this.menorStock()
                        this.mayorStock()
                        this.precioFinal = this.calculadoraDeCarrito(this.carritoCompras)
                    })
                )
                /* .catch(error => console.error(error.message)) */
        },
        menorStock() {
            this.allCards.filter(productos => {
                if (productos.stock < 2) {
                    this.pocoStock.push(productos)
                }
            })
        },
        mayorStock() {
            this.allCards.filter(productos => {
                if (productos.stock > 18) {
                    this.muchoStock.push(productos)
                }
            })
        },
        meterProductoACarrito(producto) {
            if (!this.carritoCompras.includes(producto)) {
                this.carritoCompras.push(producto)
                localStorage.setItem('produc', JSON.stringify(this.carritoCompras))
            }
        },
        sacarProductoACarrito(producto) {
            this.carritoCompras = this.carritoCompras.filter(productoFilter => productoFilter != producto)
            localStorage.setItem('produc', JSON.stringify(this.carritoCompras))
            location.reload(true)
        },
        calculadoraDeCarrito() {
            let precioTotal = 0
            this.carritoCompras.forEach(producto => {
                precioTotal += producto.precio
            });
            return precioTotal
        },

    },
    computed: { /* funciones pero la podemos usar dentro del html va estar desactivado hasta q la llamen y nunca va parar*/
        filtroBuscadorJuguete() {
            this.objetosJuguete = this.backupJuguetes.filter(juguetes => juguetes.nombre.toLowerCase().includes(this.busqueda.toLowerCase()));
        },
        filtroBuscadorFarmacia() {
            this.objetosFarmacia = this.backupFarmacia.filter(articulo => articulo.nombre.toLowerCase().includes(this.busqueda.toLowerCase()));
        }
    },
}).mount('#app')