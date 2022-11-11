import * as THREE from '/libs/three/three.module.js';
import { VRButton } from '/libs/three/jsm/VRButton.js';
import { BoxLineGeometry } from '/libs/three/jsm/BoxLineGeometry.js';
import { Stats } from '/libs/three/jsm/stats.module.js';
import { OrbitControls } from '/libs/three/jsm/OrbitControls.js';

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( 0, 1.6, 3 );
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x505050 );

		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 2, 2, 2 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 1.6, 0);
        this.controls.update();
        
        this.stats = new Stats();
        container.appendChild( this.stats.dom );
        
        this.initScene();
        this.setupVR();
        
        window.addEventListener('resize', this.resize.bind(this) );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
	}	
    
    random( min, max ){
        return Math.random() * (max-min) + min;
    }   
    
    initScene(){
        this.radius = 0.09;
        
        this.room = new THREE.LineSegments(
					new BoxLineGeometry( 10, 10, 10, 20, 20, 20),
					new THREE.LineBasicMaterial( { color: 0x909090 } )
				);
        this.room.geometry.translate( 0, 4, 0 );
        this.scene.add( this.room );
        
        const geometry = new THREE.IcosahedronBufferGeometry( this.radius, 5 );

        for ( let i = 0; i < 100; i ++ ) {

            const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.position.x = this.random( -2, 2 );
            object.position.y = this.random( -2, 2 );
            object.position.z = this.random( -2, 2 );

            this.room.add( object );

        }
        // boxGeometry
        // const geometryCube = new THREE.BoxGeometry( 1, 1, 1 );
        // const materialBox = new THREE.MeshBasicMaterial( {color: 0x11ff00} );
        // const cube = new THREE.Mesh( geometryCube, materialBox );
        // this.room.add( cube );
        // Cone
        const geometryCone = new THREE.ConeGeometry( 0.4, 0.8, 32 );
        const materialCone = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        const cone = new THREE.Mesh( geometryCone, materialCone );
        this.room.add( cone );
        // korusKnot
        const geometryKorus = new THREE.TorusKnotGeometry( 1, 0.3, 100, 4 );
        const materialKorus = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const torusKnot = new THREE.Mesh( geometryKorus, materialKorus );
        this.room.add( torusKnot );
    }
    
    setupVR(){
        this.renderer.xr.enabled = true;
        document.body.appendChild( VRButton.createButton( this.renderer ) );
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.stats.update();
        
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };