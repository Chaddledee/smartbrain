import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm  = ({ onInputChange, onButtonSubmit }) => {
	return (
		<div>
			<p className='f3'>
				{'This magic brain will detect faces in pictures. Give it a try!'}
			</p>
			<div>
				<div className='center pa4 br3 shadow-5 w-70 form'>
					<input type="text" className='f4 pa2 w-70 center' onChange={onInputChange} />
					<button className='w-30 grow f4 link ph3 pv2 dib bg-pink' onClick={onButtonSubmit} >Detect</button>
				</div>
			</div>
		</div>
	)
}

export default ImageLinkForm;