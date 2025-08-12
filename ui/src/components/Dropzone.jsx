import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Group, Text, Image } from "@mantine/core";

export default function Dropzone({ style, file, setFile }) {
  const [rejected, setRejected] = useState(null);

  console.log(file);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles?.length) {
        const selectedFile = acceptedFiles[0];

        setFile(
          Object.assign(selectedFile, {
            preview: URL.createObjectURL(selectedFile),
          }),
        );
        setRejected(null);
      }

      if (rejectedFiles?.length) {
        setRejected(rejectedFiles[0]);
        setFile(null);
      }
    },
    [setFile],
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

      <Group>
        <Text>
          {file?.name || (typeof file === "string" && "Current Image")}
        </Text>
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
      </Group>
    </>
  );
}
