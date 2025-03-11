'use strict'

async function criarHeader() {
    const header = document.createElement('header')
    const img = document.createElement('img')
    img.src = 'img/image1'
    img.alt = 'Logo'
    header.appendChild(img)
    document.body.prepend(header)
}