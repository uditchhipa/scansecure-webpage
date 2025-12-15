from PIL import Image, ExifTags
import io
import piexif
import zipfile

def extract_metadata(file_bytes: bytes) -> dict:
    """
    Extracts EXIF and vital metadata from an image.
    Returns a dictionary of readable key-value pairs.
    """
    try:
        image = Image.open(io.BytesIO(file_bytes))
        result = {}
        
        # Basic Info
        result["Format"] = image.format
        result["Mode"] = image.mode
        result["Size"] = f"{image.width}x{image.height}"
        
        # EXIF Extraction
        exif_data = image.getexif()
        if exif_data:
            for tag_id, value in exif_data.items():
                tag = ExifTags.TAGS.get(tag_id, tag_id)
                
                # Decode bytes to string if needed
                if isinstance(value, bytes):
                    try:
                        value = value.decode(errors="ignore")
                    except:
                        value = str(value)
                
                # Limit value length for display
                if isinstance(value, str) and len(value) > 100:
                    value = value[:100] + "..."
                    
                result[str(tag)] = value

        # --- GPS Parsing Logic ---
        # GPSInfo is often Tag 34853 (0x8825). Pillow puts it in a separate dict normally, 
        # but handled via getexif().get_ifd(0x8825) usually.
        # Let's try robust extraction.
        gps_info = exif_data.get_ifd(0x8825)
        if gps_info:
            result["GPS Raw"] = str(gps_info) # Keep raw for debugging
            
            def to_degrees(value):
                # Helper to convert (deg, min, sec) tuple to decimal
                d = float(value[0])
                m = float(value[1])
                s = float(value[2])
                return d + (m / 60.0) + (s / 3600.0)

            # Tags: 1=N/S, 2=Lat, 3=E/W, 4=Lon
            if 2 in gps_info and 4 in gps_info:
                lat = to_degrees(gps_info[2])
                lon = to_degrees(gps_info[4])
                
                if gps_info.get(1) == 'S': lat = -lat
                if gps_info.get(3) == 'W': lon = -lon
                
                result["Decimal Latitude"] = lat
                result["Decimal Longitude"] = lon
                result["Google Maps Link"] = f"https://www.google.com/maps?q={lat},{lon}"
        
        return result
    except Exception as e:
        return {"error": f"Failed to parse image: {str(e)}"}

def remove_metadata(file_bytes: bytes) -> bytes:
    """
    Removes all metadata by creating a fresh copy of the image.
    Returns the clean image as bytes.
    """
    try:
        image = Image.open(io.BytesIO(file_bytes))
        
        # We create a new image without the 'info' dict (which holds EXIF)
        data = list(image.getdata())
        clean_image = Image.new(image.mode, image.size)
        clean_image.putdata(data)
        
        # Save to buffer
        output = io.BytesIO()
        # Preserve format, default to JPEG if unknown
        fmt = image.format or "JPEG"
        clean_image.save(output, format=fmt)
        
        return output.getvalue()
    except Exception as e:
        return file_bytes

# --- Spoofer & Bulk Logic ---
import piexif
import zipfile

def to_deg(value, loc):
    """
    Helper to convert decimal coordinates to DMS details for EXIF.
    Returns (degrees, minutes, seconds) in Rational format.
    """
    if value < 0:
        loc_value = loc[1]
    else:
        loc_value = loc[0]
    
    abs_value = abs(value)
    deg = int(abs_value)
    min_val = (abs_value - deg) * 60
    mnt = int(min_val)
    sec_val = (min_val - mnt) * 60
    sec = round(sec_val * 10000)
    
    return (loc_value, ((deg, 1), (mnt, 1), (sec, 10000)))

def spoof_metadata(file_bytes: bytes, lat: float, lon: float) -> bytes:
    """
    Injects fake GPS coordinates into the image.
    """
    try:
        image = Image.open(io.BytesIO(file_bytes))
        
        # Prepare GPS Data
        lat_ref, lat_dms = to_deg(lat, ["N", "S"])
        lon_ref, lon_dms = to_deg(lon, ["E", "W"])
        
        gps_ifd = {
            piexif.GPSIFD.GPSLatitudeRef: lat_ref,
            piexif.GPSIFD.GPSLatitude: lat_dms,
            piexif.GPSIFD.GPSLongitudeRef: lon_ref,
            piexif.GPSIFD.GPSLongitude: lon_dms,
        }
        
        exif_dict = {"GPS": gps_ifd}
        exif_bytes = piexif.dump(exif_dict)
        
        output = io.BytesIO()
        image.save(output, format=image.format or "JPEG", exif=exif_bytes)
        return output.getvalue()
    except Exception as e:
        print(f"Spoof Error: {e}")
        return file_bytes

def clean_files_and_zip(files_data: list) -> bytes:
    """
    Takes a list of (filename, bytes), cleans them, and zips them.
    """
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for filename, content in files_data:
            clean_content = remove_metadata(content)
            zf.writestr(f"clean_{filename}", clean_content)
    
    return zip_buffer.getvalue()
