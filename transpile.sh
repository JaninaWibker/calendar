#!/bin/bash

babel --plugins transform-react-jsx js/app.jsx --out-file js/app.js
babel --presets es2015 js/app.js --out-file js/app.fallback.js

babel --presets es2015 js/kalista.js --out-file js/kalista.fallback.js
