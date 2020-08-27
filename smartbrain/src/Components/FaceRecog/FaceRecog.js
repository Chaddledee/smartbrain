import React from 'react';
import './FaceRecog.css';

const FaceRecog  = ({ imageUrl, boxes }) => {
	return (
		<div className='center'>
			<div className='absolute mt2'>
				<img id='inputimage' src={imageUrl} alt="faces" width='500px' height='auto'/>
				{
					boxes.map(function(box, i){
						return (
							<div className='bounding-box' 
								style={{top:box.topRow, right:box.rightCol, left: box.leftCol, bottom:box.bottomRow}}>
							</div>
						)
					})
				}


			</div>
		</div>
	)
}

export default FaceRecog;