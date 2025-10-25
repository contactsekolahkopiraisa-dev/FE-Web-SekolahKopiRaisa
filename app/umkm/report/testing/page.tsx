"use client";
import React from "react";


export default async function TestingPage() {
    return (
        <div className="p-4 sm:p-6">
            {/* <h1 className="text-xl sm:text-2xl font-bold mb-4">
                Halaman Testing
            </h1>
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                <p className="text-gray-700">
                    Ini adalah halaman testing untuk fitur baru.
                </p>
            </div> */}
            <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSeZFc22eBv5Yvgu3BjxpN4MMoPbDPfhZMvxKXYRuYHDWNmOmg/viewform?embedded=true"
                width="100%"
                height="800"
            ></iframe>
        </div>
    );
}