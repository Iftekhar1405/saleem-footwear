/**
 * PDFViewer Component - PDF Catalog Viewer
 * 
 * @description
 * Displays the product catalog PDF in an embedded iframe viewer.
 * 
 * @returns {JSX.Element} PDF viewer iframe
 */

import React from 'react';
import PDF from '../components/db/pdf.pdf'

function PDFViewer() {
    return (
        <div style={{ width: '100%', height: '100vh', padding: '10px', boxSizing: 'border-box' }}>
            <iframe
                src={PDF}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                }}
                title="PDF Viewer"
            />
        </div>
    );
}

export default PDFViewer;

