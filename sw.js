
//IMPORTS

importScripts('/utilities/PWA/test/06-twittor/js/sw-utils.js');


const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';



const APP_SHELL = [
    '/utilities/PWA/test/06-twittor/',
    '/utilities/PWA/test/06-twittor/index.html',
    '/utilities/PWA/test/06-twittor/css/style.css',
    '/utilities/PWA/test/06-twittor/img/favicon.ico',
    '/utilities/PWA/test/06-twittor/js/app.js'];

const APP_SHELL_INMUTABLE =[
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/utilities/PWA/test/06-twittor/css/animate.css',
    '/utilities/PWA/test/06-twittor/js/libs/jquery.js'
];



self.addEventListener('install',e=>{
    
    const cacheStatic = caches.open(STATIC_CACHE)
    .then(cache => cache.addAll(APP_SHELL));
    
    const cacheInmutable = caches.open(INMUTABLE_CACHE)
    .then(cache => cache.addAll(APP_SHELL_INMUTABLE));
    
    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
})


self.addEventListener('activate', e=>{
    
   const respuesta =  caches.keys()
    .then(keys =>{
       keys.forEach(key =>{
         if(key !== STATIC_CACHE && key.includes('static')){
             return caches.delete(key);
         }  
       });
    });
    
    e.waitUntil(respuesta);
    
    
});


self.addEventListener('fetch', e=>{

  const respuesta =  caches.match(e.request)
    .then(resp =>{
       if(resp){
           return resp;
       } 
        else{
            return fetch(e.request)
            .then(respNew =>{
               return actualizacionCacheDinamico(DYNAMIC_CACHE,e.request,respNew); 
            });
        }
        
    });
    
    e.respondWith(respuesta);
});



