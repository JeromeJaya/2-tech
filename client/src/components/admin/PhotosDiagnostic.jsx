import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Database, Image } from "lucide-react";
import api from "@/services/api"; // Axios instance for backend requests


export const PhotosDiagnostic = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const diagnosticResults = [];

    // Test 1: Check if hanging_photos_urls column exists in MongoDB
    try {
      const res = await api.get("/diagnostics/check-column?collection=bookings&field=hanging_photos_urls");
      if (res.data.exists) {
        diagnosticResults.push({
          test: "Database Field Check",
          status: "success",
          message: "hanging_photos_urls field exists in MongoDB collection"
        });
      } else {
        diagnosticResults.push({
          test: "Database Field Check",
          status: "error",
          message: "hanging_photos_urls field missing in bookings collection"
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: "Database Field Check",
        status: "error",
        message: "MongoDB connection failed",
        details: error?.response?.data || error?.message
      });
    }

    // Test 2: Check for booking-images storage folder (assuming server exposes file uploads)
    try {
      const res = await api.get("/diagnostics/check-storage-folder?folder=booking-images");
      if (res.data.exists) {
        diagnosticResults.push({
          test: "Storage Folder Access",
          status: "success",
          message: "booking-images folder exists and is accessible",
          details: res.data
        });
      } else {
        diagnosticResults.push({
          test: "Storage Folder Access",
          status: "error",
          message: "booking-images folder not found or inaccessible",
          details: res.data
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: "Storage Folder Access",
        status: "error",
        message: "Storage access failed",
        details: error?.response?.data || error?.message
      });
    }

    // Test 3: Check storage upload permissions
    try {
      const testFile = new Blob(["test"], { type: "text/plain" });
      const formData = new FormData();
      formData.append("file", testFile, `test-upload-${Date.now()}.txt`);
      formData.append("folder", "booking-images");
      const res = await api.post("/diagnostics/test-upload", formData);
      if (res.data.success) {
        diagnosticResults.push({
          test: "Storage Upload Test",
          status: "success",
          message: "Upload permissions working correctly"
        });
        // Optionally, delete the test file by calling your backend
        await api.post("/diagnostics/delete-upload", {
          fileName: res.data.fileName,
          folder: "booking-images"
        });
      } else {
        diagnosticResults.push({
          test: "Storage Upload Test",
          status: "error",
          message: "Upload permission denied",
          details: res.data
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: "Storage Upload Test",
        status: "error",
        message: "Upload test failed",
        details: error?.response?.data || error?.message
      });
    }

    // Test 4: Check recent bookings with uploaded images
    try {
      const res = await api.get("/diagnostics/recent-bookings-with-images?limit=5");
      const bookingsWithPhotos = res.data.bookings || [];
      const photosCount = bookingsWithPhotos.reduce((total, booking) => {
        const count = Array.isArray(booking.uploaded_image_urls) ? booking.uploaded_image_urls.length : 0;
        return total + count;
      }, 0);

      diagnosticResults.push({
        test: "Recent Bookings Check",
        status: photosCount > 0 ? "success" : "warning",
        message: `Found ${bookingsWithPhotos.length} recent bookings, ${photosCount} total photos`,
        details: bookingsWithPhotos
      });
    } catch (error) {
      diagnosticResults.push({
        test: "Recent Bookings Check",
        status: "error",
        message: "Bookings check failed",
        details: error?.response?.data || error?.message
      });
    }

    setResults(diagnosticResults);
    setTesting(false);
  };

  // Same as before, for icons/colors
  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Photos System Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={runDiagnostics}
          disabled={testing}
          className="w-full"
        >
          {testing ? "Running Diagnostics..." : "Run Photo System Diagnostics"}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Diagnostic Results:</h4>
            {results.map((result, index) => (
              <div key={index} className={`p-3 border rounded-lg ${getStatusColor(result.status)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.test}</span>
                  <Badge variant={result.status === "success"
                    ? "default"
                    : result.status === "error"
                      ? "destructive"
                      : "secondary"}>
                    {result.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                {result.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600">View Details</summary>
                    <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-2">Next Steps:</h5>
            <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
              {results.some(r => r.status === "error" && r.test.includes("Field")) && (
                <li>Run the proper migration or update logic to add missing fields in MongoDB</li>
              )}
              {results.some(r => r.status === "error" && r.test.includes("Storage")) && (
                <li>Check storage folder permissions and backend file upload logic</li>
              )}
              {results.some(r => r.status === "error" && r.test.includes("Upload")) && (
                <li>Update storage permissions to allow necessary uploads to booking-images folder</li>
              )}
              {results.every(r => r.status === "success") && (
                <li>System appears healthy - check browser console for errors during booking creation</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
