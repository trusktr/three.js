import {
	AnimationClip,
	AnimationMixer,
	Matrix4,
	Quaternion,
	QuaternionKeyframeTrack,
	SkeletonHelper,
	Vector3,
	VectorKeyframeTrack
} from 'three';


function retarget( target, source, options = {} ) {

	const pos = new Vector3(),
		quat = new Quaternion(),
		scale = new Vector3(),
		bindBoneMatrix = new Matrix4(),
		relativeMatrix = new Matrix4(),
		globalMatrix = new Matrix4();

	options.preserveMatrix = options.preserveMatrix !== undefined ? options.preserveMatrix : true;
	options.preservePosition = options.preservePosition !== undefined ? options.preservePosition : true;
	options.preserveHipPosition = options.preserveHipPosition !== undefined ? options.preserveHipPosition : false;
	options.useTargetMatrix = options.useTargetMatrix !== undefined ? options.useTargetMatrix : false;
	options.hip = options.hip !== undefined ? options.hip : 'hip';
	options.names = options.names || {};

	const sourceBones = getBones( source ),
		bones = getBones( target );

	let bindBones,
		bonesPosition;

	// reset bones

	if ( target.isSkinnedMesh ) {

		target.skeleton.pose();

	} else if ( target.isSkeleton ) {

		target.pose();

	} else if ( target.isSkeletonHelper ) {

		target.skeletons.forEach( skel => skel.pose() );

	} else {

		options.useTargetMatrix = true;
		options.preserveMatrix = false;

	}

	if ( options.preservePosition ) {

		bonesPosition = [];

		for ( let i = 0; i < bones.length; i ++ ) {

			bonesPosition.push( bones[ i ].position.clone() );

		}

	}

	if ( options.preserveMatrix ) {

		// reset matrix

		target.updateMatrixWorld();

		target.matrixWorld.identity();

		// reset children matrix

		for ( let i = 0; i < target.children.length; ++ i ) {

			target.children[ i ].updateMatrixWorld( true );

		}

	}

	if ( options.offsets ) {

		bindBones = [];

		for ( let i = 0; i < bones.length; ++ i ) {

			const bone = bones[ i ];
			const sourceName = options.names[ bone.name ] || bone.name;

			if ( options.offsets[ sourceName ] ) {

				bone.matrix.multiply( options.offsets[ sourceName ] );

				bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

				bone.updateMatrixWorld();

			}

			bindBones.push( bone.matrixWorld.clone() );

		}

	}

	for ( let i = 0; i < bones.length; ++ i ) {

		const bone = bones[ i ];
		const sourceName = options.names[ bone.name ] || bone.name;

		const boneTo = getBoneByName( sourceName, sourceBones );

		globalMatrix.copy( bone.matrixWorld );

		if ( boneTo ) {

			boneTo.updateMatrixWorld();

			if ( options.useTargetMatrix ) {

				relativeMatrix.copy( boneTo.matrixWorld );

			} else {

				relativeMatrix.copy( target.matrixWorld ).invert();
				relativeMatrix.multiply( boneTo.matrixWorld );

			}

			// ignore scale to extract rotation

			scale.setFromMatrixScale( relativeMatrix );
			relativeMatrix.scale( scale.set( 1 / scale.x, 1 / scale.y, 1 / scale.z ) );

			// apply to global matrix

			globalMatrix.makeRotationFromQuaternion( quat.setFromRotationMatrix( relativeMatrix ) );

			if ( target.isObject3D || target.isSkeleton ) {

				const skeleton = target.isSkinnedMesh ? target.skeleton : target.isSkeletonHelper ? target.skeletons[ 0 ] : target,
					boneIndex = bones.indexOf( bone ),
					wBindMatrix = bindBones ? bindBones[ boneIndex ] : bindBoneMatrix.copy( skeleton.boneInverses[ boneIndex ] ).invert();

				console.log( 'skeleton?', bindBones, skeleton );

				globalMatrix.multiply( wBindMatrix );

			}

			globalMatrix.copyPosition( relativeMatrix );

		}

		if ( bone.parent && bone.parent.isBone ) {

			bone.matrix.copy( bone.parent.matrixWorld ).invert();
			bone.matrix.multiply( globalMatrix );

		} else {

			bone.matrix.copy( globalMatrix );

		}

		if ( options.preserveHipPosition && sourceName === options.hip ) {

			bone.matrix.setPosition( pos.set( 0, bone.position.y, 0 ) );

		}

		bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

		bone.updateMatrixWorld();

	}

	if ( options.preservePosition ) {

		for ( let i = 0; i < bones.length; ++ i ) {

			const bone = bones[ i ];
			const sourceName = options.names[ bone.name ] || bone.name;

			if ( sourceName !== options.hip ) {

				bone.position.copy( bonesPosition[ i ] );

			}

		}

	}

	if ( options.preserveMatrix ) {

		// restore matrix

		target.updateMatrixWorld( true );

	}

}

function retargetClip( target, source, clip, options = {} ) {

	options.useFirstFramePosition = options.useFirstFramePosition !== undefined ? options.useFirstFramePosition : false;
	// Calculate the fps from the source clip based on the track with the most frames, unless fps is already provided.
	options.fps = options.fps !== undefined ? options.fps : ( Math.max( ...clip.tracks.map( track => track.times.length ) ) / clip.duration );
	options.names = options.names || [];

	// If source is a skeleton, get a skeleton helper because we can't run
	// AnimationMixer on a non-Object3D.
	if ( ! source.isObject3D ) {

		source = getHelperFromSkeleton( source );

	}

	const numFrames = Math.round( clip.duration * ( options.fps / 1000 ) * 1000 ),
		delta = clip.duration / ( numFrames - 1 ),
		convertedTracks = [],
		mixer = new AnimationMixer( source ),
		bones = getBones( target ),
		boneDatas = [];
	let positionOffset;

	mixer.clipAction( clip ).play();
	mixer.update( 0 );

	// Do we need to instead call updateWorldMatrix(true, true) so that parent
	// transforms are taken into account?
	source.updateMatrixWorld();

	for ( let i = 0; i < numFrames; ++ i ) {

		const time = i * delta;

		retarget( target, source, options );

		for ( let j = 0; j < bones.length; ++ j ) {

			const name = options.names[ bones[ j ].name ] || bones[ j ].name;

			const boneTo = getBoneByName( name, source );

			if ( boneTo ) {

				const bone = bones[ j ];
				const boneData = boneDatas[ j ] = boneDatas[ j ] || { bone: bone };

				if ( options.hip === name ) {

					if ( ! boneData.pos ) {

						boneData.pos = {
							times: new Float32Array( numFrames ),
							values: new Float32Array( numFrames * 3 )
						};

					}

					if ( options.useFirstFramePosition ) {

						if ( i === 0 ) {

							positionOffset = bone.position.clone();

						}

						bone.position.sub( positionOffset );

					}

					boneData.pos.times[ i ] = time;

					bone.position.toArray( boneData.pos.values, i * 3 );

				}

				if ( ! boneData.quat ) {

					boneData.quat = {
						times: new Float32Array( numFrames ),
						values: new Float32Array( numFrames * 4 )
					};

				}

				boneData.quat.times[ i ] = time;

				bone.quaternion.toArray( boneData.quat.values, i * 4 );

			}

		}

		if ( i === numFrames - 2 ) {

			// last mixer update before final loop iteration
			// make sure we do not go over or equal to clip duration
			mixer.update( delta - 0.0000001 );

		} else {

			mixer.update( delta );

		}

		source.updateMatrixWorld();

	}

	for ( let i = 0; i < boneDatas.length; ++ i ) {

		const boneData = boneDatas[ i ];

		if ( boneData ) {

			if ( boneData.pos ) {

				convertedTracks.push( new VectorKeyframeTrack(
					'.bones[' + boneData.bone.name + '].position',
					boneData.pos.times,
					boneData.pos.values
				) );

			}

			convertedTracks.push( new QuaternionKeyframeTrack(
				'.bones[' + boneData.bone.name + '].quaternion',
				boneData.quat.times,
				boneData.quat.values
			) );

		}

	}

	mixer.uncacheAction( clip );

	return new AnimationClip( clip.name, - 1, convertedTracks );

}

function clone( source ) {

	const sourceLookup = new Map();
	const cloneLookup = new Map();

	const clone = source.clone();

	parallelTraverse( source, clone, function ( sourceNode, clonedNode ) {

		sourceLookup.set( clonedNode, sourceNode );
		cloneLookup.set( sourceNode, clonedNode );

	} );

	clone.traverse( function ( node ) {

		if ( ! node.isSkinnedMesh ) return;

		const clonedMesh = node;
		const sourceMesh = sourceLookup.get( node );
		const sourceBones = sourceMesh.skeleton.bones;

		clonedMesh.skeleton = sourceMesh.skeleton.clone();
		clonedMesh.bindMatrix.copy( sourceMesh.bindMatrix );

		clonedMesh.skeleton.bones = sourceBones.map( function ( bone ) {

			return cloneLookup.get( bone );

		} );

		clonedMesh.bind( clonedMesh.skeleton, clonedMesh.bindMatrix );

	} );

	return clone;

}

// internal helper

function getBoneByName( name, obj ) {

	for ( let i = 0, bones = getBones( obj ); i < bones.length; i ++ ) {

		if ( name === bones[ i ].name )

			return bones[ i ];

	}

}

function getBones( obj ) {

	return obj.isSkinnedMesh
		? obj.skeleton.bones
		: obj.isSkeleton || obj.isSkeletonHelper
			? obj.bones
			: Array.isArray( obj )
				? obj
				: [];

}

function getHelperFromSkeleton( skeleton ) {

	const source = new SkeletonHelper( skeleton.bones[ 0 ] );
	console.log( ' ----------------------------- source before', source.skeletons );
	source.skeletons[ 0 ] = skeleton;
	// source.skeleton = skeleton;
	Object.defineProperty( source, 'skeleton', { get() {

		console.log( ' ########## GET SKELETON' );
		// debugger
		return skeleton;

	} } );
	console.log( ' ----------------------------- source', source.skeletons );

	return source;

}

function parallelTraverse( a, b, callback ) {

	callback( a, b );

	for ( let i = 0; i < a.children.length; i ++ ) {

		parallelTraverse( a.children[ i ], b.children[ i ], callback );

	}

}

export {
	retarget,
	retargetClip,
	clone,
};
