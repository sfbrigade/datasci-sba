import fetch from 'isomorphic-fetch'

export const getGeometry = () => fetch(window.topoUrl).then(data => data.json())

export const getRegions = () => fetch(window.regionsUrl).then(data => data.json())

// TODO replace this with a real AJAX call once we have the backend endpoint ready
export const getBusinesses = () => Promise.resolve({
	data: [
		{id: 1, position: {lat: 37.779014, lng: -122.419350}, name: 'City Hall', rating: 1, numEmployees: 400},
		{id: 2, position: {lat: 37.795301, lng: -122.393514}, name: 'Ferry Building', rating: 2, numEmployees: 100},
		{id: 3, position: {lat: 37.802480, lng: -122.405801}, name: 'Coit Tower', rating: 3, numEmployees: 1000},
	]
})