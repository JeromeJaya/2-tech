import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, AlertCircle, Database, Image } from "lucide-react";

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const PhotosDiagnostic = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const diagnosticResults: DiagnosticResult[] = [];

    // Test 1: Check if hanging_photos_urls column exists
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('hanging_photos_urls')
        .limit(1);
      
      if (error) {
        diagnosticResults.push({
          test: 'Database Column Check',
          status: 'error',
          message: 'hanging_photos_urls column missing or inaccessible',
          details: error.message
        });
      } else {
        diagnosticResults.push({
          test: 'Database Column Check',
          status: 'success',
          message: 'hanging_photos_urls column exists'
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: 'Database Column Check',
        status: 'error',
        message: 'Database connection failed',
        details: error
      });
    }

    // Test 2: Check storage bucket access
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        diagnosticResults.push({
          test: 'Storage Bucket Access',
          status: 'error',
          message: 'Cannot access storage buckets',
          details: bucketError.message
        });
      } else {
        const bookingImagesBucket = buckets?.find(bucket => bucket.id === 'booking-images');
        if (bookingImagesBucket) {
          diagnosticResults.push({
            test: 'Storage Bucket Access',
            status: 'success',
            message: 'booking-images bucket exists and is accessible',
            details: bookingImagesBucket
          });
        } else {
          diagnosticResults.push({
            test: 'Storage Bucket Access',
            status: 'error',
            message: 'booking-images bucket not found'
          });
        }
      }
    } catch (error) {
      diagnosticResults.push({
        test: 'Storage Bucket Access',
        status: 'error',
        message: 'Storage access failed',
        details: error
      });
    }

    // Test 3: Check storage upload permissions
    try {
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const testFileName = `test-upload-${Date.now()}.txt`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('booking-images')
        .upload(testFileName, testFile);

      if (uploadError) {
        diagnosticResults.push({
          test: 'Storage Upload Test',
          status: 'error',
          message: 'Upload permission denied',
          details: uploadError.message
        });
      } else {
        // Clean up test file
        await supabase.storage.from('booking-images').remove([testFileName]);
        
        diagnosticResults.push({
          test: 'Storage Upload Test',
          status: 'success',
          message: 'Upload permissions working correctly'
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: 'Storage Upload Test',
        status: 'error',
        message: 'Upload test failed',
        details: error
      });
    }

    // Test 4: Check recent bookings with photos
    try {
      const { data: bookingsWithPhotos, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, booking_id, uploaded_image_urls, selected_addons')
        .not('uploaded_image_urls', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingsError) {
        diagnosticResults.push({
          test: 'Recent Bookings Check',
          status: 'error',
          message: 'Cannot check recent bookings',
          details: bookingsError.message
        });
      } else {
        const photosCount = bookingsWithPhotos?.reduce((total, booking: any) => {
          const photos2 = Array.isArray(booking.uploaded_image_urls) ? booking.uploaded_image_urls.length : 0;
          return total + photos2;
        }, 0) || 0;

        diagnosticResults.push({
          test: 'Recent Bookings Check',
          status: photosCount > 0 ? 'success' : 'warning',
          message: `Found ${bookingsWithPhotos?.length || 0} recent bookings, ${photosCount} total photos`,
          details: bookingsWithPhotos
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: 'Recent Bookings Check',
        status: 'error',
        message: 'Bookings check failed',
        details: error
      });
    }

    setResults(diagnosticResults);
    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
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
          {testing ? 'Running Diagnostics...' : 'Run Photo System Diagnostics'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Diagnostic Results:</h4>
            {results.map((result, index) => (
              <div key={index} className={`p-3 border rounded-lg ${getStatusColor(result.status)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.test}</span>
                  <Badge variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}>
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
              {results.some(r => r.status === 'error' && r.test.includes('Column')) && (
                <li>Run the database migration script (fix_database.sql) in Supabase SQL Editor</li>
              )}
              {results.some(r => r.status === 'error' && r.test.includes('Storage')) && (
                <li>Check storage bucket configuration and RLS policies in Supabase dashboard</li>
              )}
              {results.some(r => r.status === 'error' && r.test.includes('Upload')) && (
                <li>Update storage policies to allow public uploads to booking-images bucket</li>
              )}
              {results.every(r => r.status === 'success') && (
                <li>System appears healthy - check browser console for errors during booking creation</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};