﻿import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "pettracker.ui";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7175';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false
            },
            '^/openapi': {
                target,
                secure: false
            },
            '^/getauth': {
                target,
                secure: false
            },
            '^/register': {
                target,
                secure: false
            },
            '^/login': {
                target,
                secure: false
            },
            '^/logout': {
                target,
                secure: false
            },
            '^/forgotPassword': {
                target,
                secure: false
            },
            //pet
            '^/pet': {
                target,
                secure: false
            },
            '^/api/Pet/GetPets': {
                target,
                secure: false
            },
            '^/api/Pet/GetPet': {
                target,
                secure: false
            },
            '^/api/Pet/CreatePet': {
                target,
                secure: false
            },
            '^/api/Pet/UpdatePet': {
                target,
                secure: false
            },
            '^/api/Pet/GetPetTypes': {
                target,
                secure: false
            },
            '^/api/Pet/GetPetBreeds': {
                target,
                secure: false
            },
            //owner
            '^/owner': {
                target,
                secure: false
            },
            '^/api/Owner/GetStates': {
                target,
                secure: false
            },
            '^/api/Owner/CreateOwner': {
                target,
                secure: false
            },
            '^/api/Owner/UpdateOwner': {
                target,
                secure: false
            },
            '^/api/Owner/GetOwners': {
                target,
                secure: false
            },
            '^/api/Owner/AddExistingPetsToOwner': {
                target,
                secure: false
            },
            '^/api/Owner/RemoveExistingPetFromOwner': {
                target,
                secure: false
            },
        },
        port: parseInt(env.DEV_SERVER_PORT || '50449'),
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
