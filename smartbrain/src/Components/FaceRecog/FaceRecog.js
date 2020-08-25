import React from 'react';
import './FaceRecog.css';

const FaceRecog  = ({ imageUrl, box }) => {
	return (
		<div className='center'>
			<div className='absolute mt2'>
				<img id='inputimage' src={imageUrl} alt="faces" width='500px' height='auto'/>
				<div className='bounding-box' 
					style={{top:box.topRow, right:box.rightCol, left: box.leftCol, bottom:box.bottomRow}}>
				</div>
			</div>
		</div>
	)
}

export default FaceRecog;