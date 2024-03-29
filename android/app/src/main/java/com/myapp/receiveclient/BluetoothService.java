/*
 * Copyright (C) 2009 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.myapp.receiveclient;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.UUID;

@SuppressLint("NewApi")
public class BluetoothService {
    private static final String TAG = "Bluetooth Service";
    private static final String NAME_SECURE = "Bluetooth Secure";
    private static final UUID UUID_ANDROID_DEVICE =
            UUID.fromString("fa87c0d0-afac-11de-8a39-0800200c9a66");
    private static final UUID UUID_OTHER_DEVICE =
            UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    private final BluetoothAdapter mAdapter;
    private final Handler mHandler;
    private AcceptThread mSecureAcceptThread;
    private ConnectThread mConnectThread;
    private ConnectedThread mConnectedThread;
    private int mState;
    private boolean isAndroid = BluetoothState.DEVICE_ANDROID;

    public BluetoothService(Context context, Handler handler) {
        mAdapter = BluetoothAdapter.getDefaultAdapter();
        mState = BluetoothState.STATE_NONE;
        mHandler = handler;
    }


    private synchronized void setState(int state) {
        Log.d(TAG, "setState() " + mState + " -> " + state);
        mState = state;

        mHandler.obtainMessage(BluetoothState.MESSAGE_STATE_CHANGE, state, -1).sendToTarget();
    }

    public synchronized int getState() {
        return mState;
    }

    //开启子线程
    public synchronized void start(boolean isAndroid) {
        // Cancel any thread attempting to make a connection
        if (mConnectThread != null) {
            mConnectThread.cancel();
            mConnectThread = null;
        }
        if (mConnectedThread != null) {
            mConnectedThread.cancel();
            mConnectedThread = null;
        }

        setState(BluetoothState.STATE_LISTEN);

        //开启子线程
        if (mSecureAcceptThread == null) {
            mSecureAcceptThread = new AcceptThread(isAndroid);
            mSecureAcceptThread.start();
            BluetoothService.this.isAndroid = isAndroid;
        }
    }

    public synchronized void connect(BluetoothDevice device) {
        // Cancel any thread attempting to make a connection
        if (mState == BluetoothState.STATE_CONNECTING) {
            if (mConnectThread != null) {
                mConnectThread.cancel();
                mConnectThread = null;
            }
        }

        // Cancel any thread currently running a connection
        if (mConnectedThread != null) {
            mConnectedThread.cancel();
            mConnectedThread = null;
        }

        // Start the thread to connect with the given device
        mConnectThread = new ConnectThread(device);
        mConnectThread.start();
        setState(BluetoothState.STATE_CONNECTING);
    }

    /**
     * Start the ConnectedThread to begin managing a Bluetooth connection
     *
     * @param socket The BluetoothSocket on which the connection was made
     * @param device The BluetoothDevice that has been connected
     */
    public synchronized void connected(BluetoothSocket socket, BluetoothDevice
            device, final String socketType) {
        if (mConnectThread != null) {
            mConnectThread.cancel();
            mConnectThread = null;
        }

        if (mConnectedThread != null) {
            mConnectedThread.cancel();
            mConnectedThread = null;
        }

        if (mSecureAcceptThread != null) {
            mSecureAcceptThread.cancel();
            mSecureAcceptThread = null;
        }

        mConnectedThread = new ConnectedThread(socket, socketType);
        mConnectedThread.start();

        Message msg = mHandler.obtainMessage(BluetoothState.MESSAGE_DEVICE_NAME);
        Bundle bundle = new Bundle();
        bundle.putString(BluetoothState.DEVICE_NAME, device.getName());
        bundle.putString(BluetoothState.DEVICE_ADDRESS, device.getAddress());
        msg.setData(bundle);
        mHandler.sendMessage(msg);
        setState(BluetoothState.STATE_CONNECTED);
    }

    public synchronized void stop() {
        if (mConnectThread != null) {
            mConnectThread.cancel();
            mConnectThread = null;
        }

        if (mConnectedThread != null) {
            mConnectedThread.cancel();
            mConnectedThread = null;
        }

        if (mSecureAcceptThread != null) {
            mSecureAcceptThread.cancel();
            mSecureAcceptThread.kill();
            mSecureAcceptThread = null;
        }
        setState(BluetoothState.STATE_NONE);
    }

    public void write(byte[] out) {
        ConnectedThread r;
        synchronized (this) {
            if (mState != BluetoothState.STATE_CONNECTED) return;
            r = mConnectedThread;
        }
        r.write(out);
    }

    private void connectionFailed() {
        BluetoothService.this.start(BluetoothService.this.isAndroid);
    }

    private void connectionLost() {
        BluetoothService.this.start(BluetoothService.this.isAndroid);
    }

    //监听蓝牙连接的线程
    private class AcceptThread extends Thread {
        private BluetoothServerSocket mmServerSocket;
        private String mSocketType;
        boolean isRunning = true;

        public AcceptThread(boolean isAndroid) {
            BluetoothServerSocket tmp = null;
            try {
                if (isAndroid)
                    //获取蓝牙socket
                    tmp = mAdapter.listenUsingRfcommWithServiceRecord(NAME_SECURE, UUID_ANDROID_DEVICE);
                else
                    tmp = mAdapter.listenUsingRfcommWithServiceRecord(NAME_SECURE, UUID_OTHER_DEVICE);
            } catch (IOException e) {
            }
            mmServerSocket = tmp;
        }

        public void run() {
            setName("AcceptThread" + mSocketType);
            BluetoothSocket socket = null;
            //死循环监听蓝牙连接状态，首次今进入一定满足条件，蓝牙连上后，循环停止
            while (mState != BluetoothState.STATE_CONNECTED && isRunning) {
                try {
                    socket = mmServerSocket.accept();
                } catch (IOException e) {
                    break;
                }

                if (socket != null) {
                    synchronized (BluetoothService.this) {
                        switch (mState) {
                            case BluetoothState.STATE_LISTEN:
                            case BluetoothState.STATE_CONNECTING:
                                connected(socket, socket.getRemoteDevice(),
                                        mSocketType);
                                break;
                            case BluetoothState.STATE_NONE:
                            case BluetoothState.STATE_CONNECTED:
                                try {
                                    socket.close();
                                } catch (IOException e) {
                                }
                                break;
                        }
                    }
                }
            }
        }

        public void cancel() {
            try {
                mmServerSocket.close();
                mmServerSocket = null;
            } catch (IOException e) {
            }
        }

        public void kill() {
            isRunning = false;
        }
    }


    private class ConnectThread extends Thread {
        private final BluetoothSocket mmSocket;
        private final BluetoothDevice mmDevice;
        private String mSocketType;

        public ConnectThread(BluetoothDevice device) {
            mmDevice = device;
            BluetoothSocket tmp = null;

            try {
                if (BluetoothService.this.isAndroid)
                    tmp = device.createRfcommSocketToServiceRecord(UUID_ANDROID_DEVICE);
                else
                    tmp = device.createRfcommSocketToServiceRecord(UUID_OTHER_DEVICE);
            } catch (IOException e) {
            }
            mmSocket = tmp;
        }

        public void run() {
            mAdapter.cancelDiscovery();

            try {
                mmSocket.connect();
            } catch (IOException e) {
                try {
                    mmSocket.close();
                } catch (IOException e2) {
                }
                connectionFailed();
                return;
            }

            synchronized (BluetoothService.this) {
                mConnectThread = null;
            }
            connected(mmSocket, mmDevice, mSocketType);
        }

        public void cancel() {
            try {
                mmSocket.close();
            } catch (IOException e) {
            }
        }
    }

    public static int ByteArrayToInt(byte b[]) throws Exception {
        ByteArrayInputStream buf = new ByteArrayInputStream(b);
        DataInputStream dis = new DataInputStream(buf);
        return dis.readInt();

    }

    private class ConnectedThread extends Thread {
        private final BluetoothSocket mmSocket;
        private final InputStream mmInStream;
        private final OutputStream mmOutStream;

        public ConnectedThread(BluetoothSocket socket, String socketType) {
            mmSocket = socket;
            InputStream tmpIn = null;
            OutputStream tmpOut = null;

            try {
                tmpIn = socket.getInputStream();
                tmpOut = socket.getOutputStream();
            } catch (IOException e) {
            }

            mmInStream = tmpIn;
            mmOutStream = tmpOut;
        }

        public void run() {
            byte[] buffer;
            ArrayList<Integer> arr_byte = new ArrayList<Integer>();
            while (true) {
                try {
                    boolean valid = true;
                    //判断前六位是不是12345
                    for (int i = 0; i < 6; i++) {
                        int t = mmInStream.read();
                        if (t != i) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) {
                        byte[] bufLength = new byte[4];
                        for (int i = 0; i < 4; i++) {
                            bufLength[i] = ((Integer) mmInStream.read()).byteValue();
                        }

                        int textCount = 0;
                        int photoCount = 0;
                        int videoCount = 0;

                        for (int i = 0; i < 4; i++) {
                            int read = mmInStream.read();
                            if (read == 0) {
                                textCount++;
                            } else if (read == 1) {
                                photoCount++;
                            } else if (read == 2) {
                                videoCount++;
                            }
                        }
                        int length = ByteArrayToInt(bufLength);
                        buffer = new byte[length];
                        for (int i = 0; i < length; i++) {
                            buffer[i] = ((Integer) mmInStream.read()).byteValue();
                        }
                        Message msg = Message.obtain();
                        msg.what = BluetoothState.MESSAGE_READ;
                        msg.obj = buffer;

                        if (textCount == 4) {
                            msg.arg1 = 0;
                            mHandler.sendMessage(msg);
                        } else if (photoCount == 4) {
                            msg.arg1 = 1;
                            mHandler.sendMessage(msg);
                        } else if (videoCount == 4) {
                            msg.arg1 = 2;
                            mHandler.sendMessage(msg);
                        }
                    }

                } catch (IOException e) {
                    connectionLost();
                    BluetoothService.this.start(BluetoothService.this.isAndroid);
                    break;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        public void write(byte[] buffer) {
            try {/*
                byte[] buffer2 = new byte[buffer.length + 2];
                for(int i = 0 ; i < buffer.length ; i++) 
                    buffer2[i] = buffer[i];
                buffer2[buffer2.length - 2] = 0x0A;
                buffer2[buffer2.length - 1] = 0x0D;*/
                mmOutStream.write(buffer);
                // Share the sent message back to the UI Activity
//                mHandler.obtainMessage(BluetoothState.MESSAGE_WRITE
//                        , -1, -1, buffer).sendToTarget();
            } catch (IOException e) {

            }
        }

        public void cancel() {
            try {
                mmSocket.close();
            } catch (IOException e) {

            }
        }
    }
}