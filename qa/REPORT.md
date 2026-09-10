# 實測結果

日期：2026-09-10。透過 Codex 現有 in-app browser 連接已登入嘅 Gemini 網頁版；當時可見模式標籤為 Flash。未推斷背後模型版本。

## 已通過

1. Codex 派發第一輪純 JavaScript 函數任務，觀察到訊息送出及 Gemini 生成狀態。
2. 讀取帶有相同任務 ID、輪次及結尾標記嘅完整回答。
3. Codex 審查三行函數後，喺 Node v24.19.0 執行 4 個案例、8 個斷言，全部通過。
4. Codex 加入混合輸入要求並指出測試聲明欠缺證據，再派發第二輪。
5. Gemini 回傳修訂版本，並將測試聲明改成「Checks actually run: None」。
6. Codex 審查修訂函數後執行 8 個案例、16 個斷言，全部通過，包括 NaN、Infinity、非數值、不可修改輸入及禁止物件隱式轉型。

Gemini 第一輪嘅測試執行聲明無可見證據，所以無採納為本機測試結果。第二輪描述提及 iterable，但一般 iterable 未必有 reduce；整合後嘅支援範圍維持為 Array。

原始回答以對應回答區嘅可見 DOM 文字保存；程式碼另行抽取並經 Codex 閱讀，測試檔只加咗匯出介面。Copy 按鈕顯示成功但瀏覽器剪貼簿讀取未提供文字，因此改用工具支援嘅唯讀 DOM 擷取，呢個實際經驗已加入 Skill。

## 重跑本機驗收

喺外掛資料夾，用有 Node.js 嘅終端執行：

```text
node qa/verify.cjs 1
node qa/verify.cjs 2
```

實際輸出：

```json
{"round":1,"cases":4,"assertions":8,"status":"passed","runtime":"v24.19.0"}
{"round":2,"cases":8,"assertions":16,"status":"passed","runtime":"v24.19.0"}
```

外掛及 Skill 通過官方 `validate_plugin.py`、`quick_validate.py` 格式檢查。檢查器需要嘅 PyYAML 安裝喺暫存目錄，唔係外掛執行時依賴。

## 呢次測試未涵蓋

以上兩輪係由當時嘅 Codex task 讀取流程後操作現有瀏覽器工具，無涵蓋新 task 自動發現。未測登入過期、網頁限流、長答案截斷、網絡中斷、併發、背景自動喚醒，亦無量度成本或速度。以上兩輪只證明呢次文字／程式碼來回同驗收成功。包含私人對話連結及瀏覽器識別資料嘅 `qa/task.json` 只保留喺本機，已從版本控制排除。
