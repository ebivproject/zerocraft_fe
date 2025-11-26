"use client";

import { useState } from "react";
import styles from "./SimpleInputForm.module.css";

export interface SimpleInputData {
    itemName: string;
    category: string;
    overview: string;
}

interface SimpleInputFormProps {
    onSubmit: (data: SimpleInputData) => void;
}

export default function SimpleInputForm({ onSubmit }: SimpleInputFormProps) {
    const [data, setData] = useState<SimpleInputData>({
        itemName: "",
        category: "",
        overview: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.itemName || !data.category || !data.overview) {
            alert("모든 항목을 입력해주세요.");
            return;
        }
        onSubmit(data);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>아이디어 스케치</h2>
            <p className={styles.description}>
                간단한 아이디어만 입력하면 AI가 초기 사업계획서를 만들어드립니다.
                <br />
                지금 바로 무료로 확인해보세요!
            </p>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="itemName" className={styles.label}>
                        창업 아이템 명칭
                    </label>
                    <input
                        type="text"
                        id="itemName"
                        name="itemName"
                        value={data.itemName}
                        onChange={handleChange}
                        placeholder="예: AI 기반 맞춤형 영양제 구독 서비스"
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.label}>
                        분야 / 카테고리
                    </label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={data.category}
                        onChange={handleChange}
                        placeholder="예: 헬스케어, 플랫폼, 제조 등"
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="overview" className={styles.label}>
                        아이템 간단 설명
                    </label>
                    <textarea
                        id="overview"
                        name="overview"
                        value={data.overview}
                        onChange={handleChange}
                        placeholder="어떤 문제를 해결하고, 어떤 가치를 제공하나요? 간단하게 적어주세요."
                        className={styles.textarea}
                        required
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    무료로 사업계획서 초안 만들기 ✨
                </button>
            </form>
        </div>
    );
}
