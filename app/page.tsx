'use client';
import { useState } from 'react';
import {
  DrivePicker,
  DrivePickerDocsView,
} from '@googleworkspace/drive-picker-react';
import styles from './page.module.css';

export interface GooglePickerDoc {
  id: string;
  name: string;
  mimeType: string;
  url: string;
  lastEditedUtc: number;
  iconUrl: string;
  parentId: string;
  organizationDisplayName?: string;
  sizeBytes?: number;
  type?: string;
}

export interface GooglePickerResult {
  detail: {
    action: 'picked' | 'cancel';
    docs: GooglePickerDoc[];
  };
}

type GooglePickerResponse =
  | { detail: { action: 'picked'; docs: GooglePickerDoc[] } }
  | { detail: { action: 'cancel'; docs?: never } };

export default function Home() {
  const [sheetId, setSheetId] = useState<string | null>();
  const [isOpen, setIsOpen] = useState(false);
  // This helps React treat every "Open" as a brand new instance
  const [pickerId, setPickerId] = useState(0);

  const CLIENT_ID =
    '131449573592-iijnqpmuimmvo370q9q5b1p8cac9pt5d.apps.googleusercontent.com';
  const APP_ID = 'project-443d0780-9616-4fde-9c4';
  const API_KEY = 'AIzaSyBtd_lUL6wP5nwasyRqnkkZZgNLQPmEInk';

  const handleOpenPicker = () => {
    setPickerId((prev) => prev + 1);
    setIsOpen(true);
  };

  function handlePicked(data: GooglePickerResponse) {
    // 1. Check if the user actually clicked "Select/Open"
    if (data.detail.action === 'picked') {
      // 2. Check if the docs array exists and has at least one item
      if (data.detail.docs && data.detail.docs.length > 0) {
        const selectedSheet = data.detail.docs[0];
        setSheetId(selectedSheet.id);
        console.log('Success! ID:', selectedSheet.id);
      }
    }

    // 3. Handle the Cancel action (optional)
    if (data.detail.action === 'cancel') {
      console.log('User closed the picker without selecting anything.');
      // You could clear a loading state here if you have one
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button
          onClick={handleOpenPicker}
          className="picker__btn"
          disabled={isOpen}
        >
          {isOpen ? 'Picker Active...' : 'Select Google Sheet'}
        </button>

        {/* Manual reset link in case the COOP error breaks the 'Cancel' signal */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            style={{
              fontSize: '12px',
              marginLeft: '10px',
              color: 'red',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              textDecoration: 'none',
            }}
          >
            Cancel / Reset
          </button>
        )}

        {isOpen && (
          <DrivePicker
            key={pickerId} // Force fresh mount
            client-id={CLIENT_ID}
            developer-key={API_KEY}
            app-id={APP_ID}
            onPicked={handlePicked}
          >
            <DrivePickerDocsView
              view-id="SPREADSHEETS"
              mime-types="application/vnd.google-apps.spreadsheet"
            />
          </DrivePicker>
        )}

        <p className="picker__sheet-id">
          Selected Document ID: <strong>{sheetId}</strong>
        </p>
      </main>
    </div>
  );
}
