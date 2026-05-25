# ブログ半自動化プロジェクト マスタードキュメント

最終更新: 2026-05-24
バージョン: v1.0

---

## 1. プロジェクト概要

- **ブログ名**: ライター副業ラボ
- **URL**: https://tsuzuku-lab.mods.jp/wordpress/
- **現状**: 3記事公開済み（記事4から半自動化フロー開始）
- **目標**: 30記事投稿によるSEO評価獲得 → PV増加 → 収益化
- **AI/人間の作業比率目標**: 現在6:4 → 8:2(AI:人間)
- **1記事あたりの目標工数**: 30分（記事20本以降は20分）

---

## 2. ペルソナ（確定）

| 項目 | 内容 |
|------|------|
| 基本属性 | 24〜28歳・男性・会社員・手取り20万前後 |
| 副業経験 | スキルなし・副業経験1〜3回挫折済み |
| 抱えている感情 | 【恐怖】また失敗するかもしれない／【焦り】このままじゃヤバい・収入を上げなければ／【疑問】自分みたいなスキルなしでも本当にできるのか |
| 情報への態度 | 成功者の声には疲れている。同じ目線で動いている人間の体験ベースのブログを求めている |
| ライティングへの関心 | ライティング副業に興味はあるが「自分みたいなスキルなしでも本当にできるのか」が最大の疑問 |

詳細は `assets/02_persona.md` を参照。

---

## 3. 設計思想：弁当箱メタファー

| 要素 | 担当 | 出典 |
|------|------|------|
| 器（構造・CTA・ライティング技法） | Claude Code | 参考2記事から抽象化 |
| 中身（文体・一次情報・口語表現） | あなた100% | あなた自身 |
| 素材（リサーチデータ・統計） | Claude Code | Web検索・NotebookLM |

**配合比率**: パターンC = 参考記事70% + 第3記事30%（「器」のみ。中身は常にあなた100%）

---

## 4. 参考記事

- **文体の参考**: https://hitodeblog.com/
- **構成・CTA・マイクロコンバージョンの参考**: https://meril.co.jp/affi-note/

**取扱ルール**: 型・構造・原則のみ抽象化して `assets/07_style-references.md` に保存。文章表現の直接コピーはしない。

---

## 5. 「文章表現」の3レベル定義

| レベル | 内容 | 扱い |
|--------|------|------|
| レベル1（フレーズ） | 「ぶっちゃけ」「正直」「めちゃくちゃ」「（笑）」など口語表現 | 自由に使用可（あなたの口癖） |
| レベル2（センテンス丸ごとコピー） | 参考記事の文・段落をそのまま使用 | 絶対NG（著作権・SEO） |
| レベル3（ライティング技法） | 不安先読み・PAS・ベネフィット訴求・CTA設計など | 業界共通スキル、参考にしてOK |

---

## 6. 品質目標（フェーズ別）

| フェーズ | 記事番号 | 目標品質 | 位置づけ |
|----------|----------|----------|----------|
| 旧型 | 記事1-2 | 40-50点 | 後でリライト対象 |
| 過渡期 | 記事3 | 60-70点 | 新フローの基準 |
| 検証 | 記事4-6 | 75-85点 | 新フロー検証期間（PDCA） |
| 量産 | 記事7-30 | 85-90点 | 参考記事レベルへ到達 |

---

## 7. ファイル構造（確定版）

```
blog-automation/
├─ CLAUDE.md                    # プロジェクト憲法（100行以内）
├─ docs/
│  ├─ project-master.md         # 本ドキュメント
│  └─ rules/
│     ├─ writing-rules.md
│     ├─ fact-audit-template.md
│     ├─ self-check-template.md
│     ├─ conflict-resolution.md
│     ├─ internal-link-rules.md
│     └─ lessons.md
├─ .claude/
│  ├─ settings.json
│  └─ commands/
│     ├─ plan.md
│     ├─ research.md
│     ├─ outline.md
│     ├─ write.md
│     ├─ self-check.md
│     ├─ check.md
│     ├─ polish.md
│     └─ publish.md
├─ assets/
│  ├─ 00_priority-rules.md      # 優先順位ルール（衝突時の判断基準）
│  ├─ 01_ng-words.md            # ✅作成済み
│  ├─ 02_persona.md             # ✅作成済み
│  ├─ 03_identity-anchors.md    # 絶対残す要素
│  ├─ 04_tone-sample.md         # 文体DNA
│  ├─ 05_structure-rules.md
│  ├─ 06_cta-patterns.md
│  ├─ 07_style-references.md    # 参考記事の型のみ抽象化
│  ├─ experiences/
│  │  ├─ INDEX.md               # タグ別索引
│  │  ├─ sedori.md
│  │  ├─ short-video.md
│  │  ├─ web-design.md
│  │  ├─ ai-fukugyo.md
│  │  └─ tshirt.md
│  ├─ numbers.md                # 数値データ（measured_at付き）
│  └─ voices/                   # 読者の生声（共通リポジトリ）
├─ prompts/
│  ├─ current/                  # symlink
│  ├─ v1/
│  └─ CHANGELOG.md
├─ topics/
│  ├─ pipeline.md               # 記事ステータス管理
│  ├─ keywords.md
│  ├─ cluster-map.md
│  └─ internal-link-map.md
├─ drafts/
│  └─ article-XXX/
│     ├─ research.md
│     ├─ research-rationale.md
│     ├─ outline.md
│     ├─ outline-rationale.md
│     ├─ info-request.md        # 追加情報依頼（必要時のみ）
│     ├─ additional-info.md     # ユーザー回答
│     ├─ body.md
│     ├─ body-rationale.md
│     ├─ self-check-report.md
│     ├─ check-report.md
│     ├─ conflict-log.md
│     ├─ sources.md
│     ├─ voices-used.md
│     └─ final.md
├─ published/
│  └─ article-XXX/
│     ├─ final.md
│     └─ meta.md
├─ analytics/
│  ├─ ranking-log.md
│  ├─ ctr-log.md
│  └─ monthly-report.md
└─ retrospective/
   └─ 2026-Q2.md
```

---

## 8. 優先順位ルール（assets/00_priority-rules.md の核）

ファイル間で情報が衝突した場合の優先順位:

1. **assets/01_ng-words.md**（絶対遵守）
2. **assets/02_persona.md**
3. **assets/03_identity-anchors.md**
4. **assets/04_tone-sample.md**
5. **assets/05_structure-rules.md**
6. **assets/06_cta-patterns.md**
7. **assets/07_style-references.md**（参考のみ）
8. **docs/rules/writing-rules.md**

衝突検出時の処理:
- 重要度「高」: 必ず停止しユーザーに確認
- 重要度「中」: 提案を提示
- 重要度「低」: `conflict-log.md` に記録して自動続行

---

## 9. ファイル取り込み対話ルール（最重要・CLAUDE.md冒頭に記載）

Claude Code は、ファイルを受け取った際、**保存前に必ず以下のプロセスを実行する**:

1. 内容を読み、自分の言葉で要約（3-5行）
2. 既存ファイルとの整合性チェック
3. 不明点・矛盾点・曖昧な表現をリストアップ
4. ユーザーに具体的に質問
5. ユーザーの「OK」を得てから保存

**質問テンプレート**:

```
【ファイル取り込みチェック】
ファイル名:
質問1:
  - 該当箇所:
  - 懸念理由:
  - 解釈の選択肢: A) ... B) ...

(矛盾なしの場合)
【取り込み準備完了】
ファイル名:
要約: <3-5行>
整合性: 問題なし
保存してよろしいですか？
```

**目的**: 「気づいたら声を上げる Claude Code」を実現し、後工程での全リライトを防ぐ。

---

## 10. ワークフロー（記事1本あたり）

| 順 | コマンド | 担当 | 出力 | 工数目安 |
|----|----------|------|------|----------|
| 1 | `/research [軸KW]` | Claude Code | research.md + rationale | 自動 |
| 2 | `/outline` | Claude Code | outline.md + rationale | 自動 |
| 3 | （必要時）info-request 確認 | あなた | additional-info.md | 5-10分 |
| 4 | `/write` | Claude Code | body.md + rationale | 自動 |
| 5 | `/self-check` | Claude Code | self-check-report.md | 自動 |
| 6 | ダブルチェック | あなた | ⚠️項目のみ確認 | 15-20分 |
| 7 | `/check` | Claude Code | check-report.md | 自動 |
| 8 | `/polish` | Claude Code | final.md（+メタ・FAQ・SNS） | 自動 |
| 9 | `/publish` | Claude Code + あなた | WordPress公開 | 5分 |

**合計ユーザー工数**: 約30分（慣れたら20分）

---

## 11. Claude Code の自問自答メカニズム

各コマンドで `*-rationale.md` を生成し、判断根拠を残す:

- **research-rationale.md**: なぜそのキーワード選定か、なぜその上位記事を重視したか、ペルソナ適合度をどう判定したか
- **outline-rationale.md**: なぜこの構成にしたか、感情ジャーニーの設計意図、CTA配置の根拠
- **body-rationale.md**: なぜその一次情報を選んだか、文体DNAへの準拠度、NGワード回避の確認

これにより、ユーザーは「結果だけでなく判断プロセス」をレビューできる。

---

## 12. 進捗状況（2026-05-24時点）

### ✅ 完了
- `assets/01_ng-words.md`
- `assets/02_persona.md`
- 全体設計の合意
- 弁当箱メタファー、パターンC、文章表現3レベル定義の確定
- ファイル取り込み対話ルールの確定

### 🚧 次のタスク（優先順位）
1. `assets/04_tone-sample.md` 作成（ステップ1-A〜1-G、合計約2時間）
2. `assets/03_identity-anchors.md` 作成
3. `assets/experiences/` 5ファイル作成
4. `assets/numbers.md` 作成
5. `assets/00_priority-rules.md` 作成
6. `CLAUDE.md` 作成
7. `.claude/commands/` 配下のコマンドファイル作成
8. 記事4を新フローで執筆

### ⏳ 保留・未着手
- 記事1・2のリサーチ計画（記事7〜10公開後に着手）
- analytics/ ・ retrospective/ の運用ルール詳細

---

## 13. tone-sample.md 作成手順（ステップ1の修正版）

| 段階 | 作業 | 担当 | 時間 |
|------|------|------|------|
| 1-A | 参考2記事から型抽出 → style-references.md | Claude Code | 25分 |
| 1-B | 3記事目分析 → tone-analysis/article-3.md | Claude Code | 15分 |
| 1-C | 1・2記事目軽分析 → tone-analysis/legacy.md | Claude Code | 10分 |
| 1-D | identity-anchors.md 作成 | あなた + Claude | 15分 |
| 1-E | 配合比率・残す要素の最終判断 | あなた | 20分 |
| 1-F | 暫定版 tone-sample.md 等 生成 | Claude Code | 15分 |
| 1-G | 記事4完成後に再確定（v1.0） | 共同 | 15分 |

**注意**: 記事1〜3の分析時は「ファイル取り込み対話ルール」を必ず適用すること。

---

## 14. 新チャット引き継ぎ用テンプレート

```
ブログ半自動化プロジェクトの続きです。
あなたは「ブログ × Claude Code で月100万稼ぐプロのブログ運営者」として、
プロ目線でアドバイスしてください。

【現状】
- assets/01_ng-words.md, assets/02_persona.md 作成済み
- マスタードキュメント（添付）に全設計が記載済み
- 次のタスク: assets/04_tone-sample.md ステップ1-Aから再開

【ルール】
- ファイル取り込み時は必ず対話ルール（マスタードキュメント9章）を適用
- 衝突検出時は優先順位ルール（同8章）に従う
- 各コマンド実行時は rationale ファイルを必ず生成

【添付】
project-master.md の全文を貼り付け

まずはステップ1-A（参考2記事の型抽出）の具体的指示文を提示してください。
```

---

## 15. 改訂履歴

| 日付 | バージョン | 変更内容 |
|------|----------|----------|
| 2026-05-24 | v1.0 | 初版作成。全体設計の確定事項を集約 |

---

*このドキュメントは Claude Code とユーザー双方が参照する正本。変更時は必ずバージョン更新*
