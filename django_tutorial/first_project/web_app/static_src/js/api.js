import fetch from 'isomorphic-fetch'

export const getGeometry = () => fetch(window.topoUrl).then(data => data.json())

export const getRegions = () => fetch(window.regionsUrl).then(data => data.json())