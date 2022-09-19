## web3-capture-action

<p align="center">
  <a href="https://github.com/pawanpaudel93/web3-capture-action/actions"><img alt="web3-capture-action status" src="https://github.com/pawanpaudel93/web3-capture-action/workflows/web3-capture-action/badge.svg"></a>
</p>

Capture single page html and screenshot of websites and save to web3.storage.


## Usage
Use this in action yml files whereever necessary.

```yaml
name: web3-capture-action
on: [push]
jobs:
  capture:
    name: Install Google Chrome & Capture
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: |
          sudo apt-get update
          sudo apt-get install -y libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnss3-dev libxss-dev libasound2
      - name: Install Google Chrome
        uses: browser-actions/setup-chrome@latest
        with:
          chrome-version: stable
      - run: npm install https://github.com/pawanpaudel93/single-file-cli
      - name: Capture webpage and screenshot
        uses: web3-capture-action@0.1
        with:
          web3_token: ${{ secrets.WEB3_STORAGE_TOKEN }}
          url_file_path: 'urls.txt'
```