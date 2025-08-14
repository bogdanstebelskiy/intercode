import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Text, Image, Flex } from "@mantine/core";

export default function Dropzone({ style, value, onChange, error }) {
  const [rejected, setRejected] = useState(null);

  const file = value;

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles?.length) {
        const selectedFile = acceptedFiles[0];

        const fileWithPreview = Object.assign(selectedFile, {
          preview: URL.createObjectURL(selectedFile),
        });

        onChange?.(fileWithPreview);
        setRejected(null);
      }

      if (rejectedFiles?.length) {
        setRejected(rejectedFiles[0]);
        onChange?.(null);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    multiple: false,
  });

  useEffect(() => {
    return () => {
      if (file && typeof file !== "string" && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const previewUrl = file && (typeof file === "string" ? file : file.preview);

  return (
    <>
      <div {...getRootProps({ style: style })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop an image here, or click to select image</p>
        )}
      </div>

      {error && (
        <Text c="red" size="sm" mt="xs">
          {error}
        </Text>
      )}

      <Flex direction="column" align="center" justify="center" gap="sm">
        <Text>{file?.name || typeof file === "string"}</Text>
        {previewUrl && <Image src={previewUrl} alt="preview" w={100} h={100} />}
        {rejected?.file && (
          <div style={{ color: "red" }}>
            <Text fw={500}>Rejected: {rejected.file.name}</Text>
            {rejected.errors.map((err, index) => (
              <Text key={index} size="sm">
                {err.message}
              </Text>
            ))}
          </div>
        )}
      </Flex>
    </>
  );
}
