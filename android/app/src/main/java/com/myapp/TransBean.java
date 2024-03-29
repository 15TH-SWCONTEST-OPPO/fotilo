package com.myapp;

import java.io.Serializable;

public class TransBean implements Serializable {

    private static final long serialVersionUID = 5378738997755484868L;

    public String type;

    public String text;

    public FileBean fileBean;

    public TransBean(String type, String text, FileBean fileBean) {
        this.type = type;
        this.text = text;
        this.fileBean = fileBean;
    }
}
