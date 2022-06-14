import os
import shutil
from pathlib import Path

dir_exclusions = ['.git']
file_exclusions = ['util.py']

def clean():
    for item in Path('./').iterdir():
        if item.is_dir() and item.name not in dir_exclusions:
            shutil.rmtree(item)
        if item.is_file() and item.name not in file_exclusions:
            item.unlink()

def port_over():
    for item in Path('../telepresence-actions').iterdir():
        if item.is_dir() and item.name not in dir_exclusions:
            shutil.copytree(item, item.name)
        if item.is_file():
            shutil.copy(item, item.name)


if __name__ == '__main__':
    clean()
    port_over()
