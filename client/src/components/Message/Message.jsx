import React from 'react'

export const messageTypes = {
	ME: 'ME',
	FRIEND: 'FRIEND',
	JOIN: 'JOIN',
	LEAVE: 'LEAVE',
};

export default function Message({ data }) {
	const {
		messageType,
		message
	} = data;

	console.log(data);

	return (
		<div className={`messageBox ${messageType}`}>
			{message}
		</div>
	)
}