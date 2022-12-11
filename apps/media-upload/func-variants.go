package function

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"cloud.google.com/go/storage"
	"github.com/disintegration/imaging"
)

func createVariant(ctx context.Context, bkt *storage.BucketHandle, i image.Image, ifmt string, f FileProps, size int, wg *sync.WaitGroup) (string, error) {
	// log.Printf("variant %s @ %d start with type %s", f.Basename  , size, ifmt)

	// resize
	var v *image.NRGBA
	v = imaging.Resize(i, size, 0, imaging.Lanczos)
	// log.Printf("variant %s @ %d resized", f.Basename  , size)

	// destination
	out := f.Basename + "_" + strconv.Itoa(size) + f.Extension
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()
	wc := bkt.Object(out).NewWriter(ctx)

	// encode
	buf := new(bytes.Buffer)
	switch ifmt {
	case "png":
		// log.Printf("encoding %s @ %d as png", f.Basename  , size)
		err := png.Encode(buf, v)
		if err != nil {
			return "", fmt.Errorf("failed to encode %v", err)
		}
	case "jpeg", "jpg":
		// log.Printf("encoding %s @ %d as jpeg", f.Basename  , size)
		err := jpeg.Encode(buf, v, &jpeg.Options{Quality: 90})
		if err != nil {
			return "", fmt.Errorf("failed to encode %v", err)
		}
	default:
		// log.Printf("failed to encode %s @ %d", f.Basename  , size)
		return "", fmt.Errorf("upload: unsupported MIME type, got = %q", ifmt)
	}

	// write file directly from memory
	// log.Printf("writing %s @ %d", f.Basename  , size)
	if _, err := io.Copy(wc, buf); err != nil {
		// log.Printf("ERROR: failed to encode %s @ %d", f.Basename, size, err)
		return "", fmt.Errorf("io.Copy: %v", err)
	}
	// log.Printf("closing %s @ %d", f.Basename  , size)
	if err := wc.Close(); err != nil {
		return "", fmt.Errorf("Writer.Close: %v", err)
	}

	// log.Printf("done %s @ %d", f.Basename  , size)
	return out, nil
}

func getFilenameDetails(name string) FileProps {
	ext := filepath.Ext(name)
	base := strings.Replace(name, ext, "", 1)
	return FileProps{ext, base}
}
