import React, { useRef, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import { Box, Icon, Text, useSnackbar } from "zmp-ui";
import { api } from "@service";
import { UploadResult } from "@dts";

const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";
const MAX_BYTES = 5 * 1024 * 1024;

interface FileUploadProps {
    label?: string;
    value?: UploadResult[];
    onChange: (files: UploadResult[]) => void;
    /** Số tệp tối đa (mặc định 5) */
    max?: number;
}

const PickButton = styled.button`
    ${tw`flex flex-row items-center gap-2 border border-dashed border-main text-main rounded-lg px-3 py-2 text-sm bg-white`}
`;

const FileRow = styled.div`
    ${tw`flex flex-row items-center justify-between bg-ng_10 rounded-lg px-3 py-2 mt-2`}
`;

const RemoveBtn = styled.button`
    ${tw`text-danger flex items-center`}
`;

/**
 * Chọn tệp (ảnh/PDF) → đọc base64 → gọi api.uploadFile → trả URL.
 * Dùng cho chứng từ chi, tài liệu họp, ảnh đính kèm... Hợp đồng khớp endpoint
 * /uploads của backend (giới hạn JPG/PNG/WEBP/PDF, ≤5MB).
 */
const FileUpload: React.FC<FileUploadProps> = ({
    label,
    value,
    onChange,
    max = 5,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const { openSnackbar } = useSnackbar();
    const files = value || [];

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (files.length >= max) {
            openSnackbar({ type: "warning", text: `Tối đa ${max} tệp` });
            return;
        }
        if (file.size > MAX_BYTES) {
            openSnackbar({ type: "warning", text: "Tệp vượt quá 5MB" });
            return;
        }
        setUploading(true);
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const res = await api.uploadFile({
                    filename: file.name,
                    contentType: file.type,
                    contentBase64: reader.result as string,
                });
                if (res && res.url) {
                    onChange([...files, res]);
                } else {
                    openSnackbar({ type: "error", text: "Tải tệp thất bại" });
                }
            } catch (err) {
                openSnackbar({ type: "error", text: "Tải tệp thất bại" });
            } finally {
                setUploading(false);
                if (inputRef.current) inputRef.current.value = "";
            }
        };
        reader.onerror = () => {
            setUploading(false);
            openSnackbar({ type: "error", text: "Không đọc được tệp" });
        };
        reader.readAsDataURL(file);
    };

    const remove = (idx: number) =>
        onChange(files.filter((_, i) => i !== idx));

    return (
        <Box>
            {label && (
                <Text size="small" tw="text-text_2 mb-2">
                    {label}
                </Text>
            )}
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                style={{ display: "none" }}
                onChange={onPick}
            />
            <PickButton type="button" onClick={() => inputRef.current?.click()}>
                <Icon icon="zi-plus" size={18} />
                {uploading ? "Đang tải..." : "Chọn tệp (ảnh/PDF)"}
            </PickButton>
            {files.map((f, idx) => (
                <FileRow key={f.url || idx}>
                    <Box tw="flex flex-row items-center flex-1 overflow-hidden">
                        <Icon icon="zi-file" size={16} />
                        <Text size="small" tw="text-text_1 ml-2 truncate">
                            {f.name}
                        </Text>
                    </Box>
                    <RemoveBtn type="button" onClick={() => remove(idx)}>
                        <Icon icon="zi-close" size={16} />
                    </RemoveBtn>
                </FileRow>
            ))}
        </Box>
    );
};

export default FileUpload;
