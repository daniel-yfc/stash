# Build Scripts

> **建置腳本集合。**

## 腳本

| 腳本 | 用途 |
| --- | --- |
| `validate-all.sh` | 驗證所有刮削器 |
| `eval-all.sh` | 執行評估 |
| `build-site.sh` | 建立網站 |
| `clean.sh` | 清理暫存 |
| `install.sh` | 安裝相依性 |
| `test.sh` | 執行測試 |

## 使用

```bash
# 驗證
./Build/Scripts/validate-all.sh

# 評估
./Build/Scripts/eval-all.sh

# 建站
./Build/Scripts/build-site.sh

# 清理
./Build/Scripts/clean.sh

# 安裝
./Build/Scripts/install.sh

# 測試
./Build/Scripts/test.sh
```

## 相依性

- Deno
- Python
- pytest
