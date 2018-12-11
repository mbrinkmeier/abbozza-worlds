package de.uos.inf.did.abbozza.worlds;

import de.uos.inf.did.abbozza.core.AbbozzaLocale;
import de.uos.inf.did.abbozza.core.AbbozzaServer;
import de.uos.inf.did.abbozza.tools.GUITool;
import java.awt.TrayIcon;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.awt.event.WindowStateListener;
import java.io.File;
import java.io.IOException;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.filechooser.FileNameExtensionFilter;

/**
 *
 * @author michael
 */


public class AbbozzaWorldsFrame extends javax.swing.JFrame {

    private AbbozzaWorlds abbozza;
    private File lastSourceFile = null;
    
    /**
     * Creates new form AbbozzaInterpreterFrame
     */
    public AbbozzaWorldsFrame(AbbozzaWorlds abbozza) {
        this.abbozza = abbozza;
        
        initComponents();
       
        this.addWindowStateListener(new WindowStateListener() {
            @Override
            public void windowStateChanged(WindowEvent e) {
                // AbbozzaLogger.debug(e.paramString());
                // AbbozzaLogger.debug(e.toString());
            }
        });
        
        this.addWindowListener(new WindowListener() {
            @Override
            public void windowOpened(WindowEvent e) {
            }

            @Override
            public void windowClosing(WindowEvent e) {
                JFrame win = (JFrame) e.getWindow();
                int state = win.getExtendedState();
                win.setExtendedState(state | JFrame.ICONIFIED);
                TrayIcon icon = ((AbbozzaWorlds) AbbozzaServer.getInstance()).getTrayIcon();
                if ( icon != null ) {
                    icon.displayMessage("", AbbozzaLocale.entry("gui.close_and_quit"), TrayIcon.MessageType.INFO);
                }
            }

            @Override
            public void windowClosed(WindowEvent e) {
            }

            @Override
            public void windowIconified(WindowEvent e) {
            }

            @Override
            public void windowDeiconified(WindowEvent e) {
            }

            @Override
            public void windowActivated(WindowEvent e) {
            }

            @Override
            public void windowDeactivated(WindowEvent e) {
            }
        });
        
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        worldBox = new javax.swing.JComboBox<>();
        jScrollPane1 = new javax.swing.JScrollPane();
        descriptionPane = new javax.swing.JTextArea();
        selectWorldButton = new javax.swing.JButton();
        jMenuBar1 = new javax.swing.JMenuBar();
        jMenu1 = new javax.swing.JMenu();
        settingsItem = new javax.swing.JMenuItem();
        jSeparator1 = new javax.swing.JPopupMenu.Separator();
        quitITem = new javax.swing.JMenuItem();

        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);
        setTitle("abbozza! Worlds");

        worldBox.setModel(abbozza.getWorldManager());
        worldBox.setSelectedIndex(0);
        worldBox.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                worldBoxActionPerformed(evt);
            }
        });

        jScrollPane1.setHorizontalScrollBar(null);

        descriptionPane.setEditable(false);
        descriptionPane.setColumns(20);
        descriptionPane.setRows(5);
        descriptionPane.setWrapStyleWord(true);
        jScrollPane1.setViewportView(descriptionPane);

        selectWorldButton.setText(AbbozzaLocale.entry("gui.SET_WORLD"));
        selectWorldButton.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                selectWorldButtonActionPerformed(evt);
            }
        });

        jMenu1.setText("abbozza!");

        settingsItem.setText(AbbozzaLocale.entry("gui.settings"));
        settingsItem.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                settingsItemActionPerformed(evt);
            }
        });
        jMenu1.add(settingsItem);
        jMenu1.add(jSeparator1);

        quitITem.setAccelerator(javax.swing.KeyStroke.getKeyStroke(java.awt.event.KeyEvent.VK_Q, java.awt.event.InputEvent.CTRL_MASK));
        quitITem.setText(AbbozzaLocale.entry("gui.QUIT"));
        quitITem.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                quitITemActionPerformed(evt);
            }
        });
        jMenu1.add(quitITem);

        jMenuBar1.add(jMenu1);

        setJMenuBar(jMenuBar1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(worldBox, 0, 376, Short.MAX_VALUE)
                    .addComponent(selectWorldButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jScrollPane1))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(worldBox, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 169, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(selectWorldButton)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void quitITemActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_quitITemActionPerformed
        System.exit(0);
    }//GEN-LAST:event_quitITemActionPerformed

    private void worldBoxActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_worldBoxActionPerformed
        descriptionPane.setText(((World) worldBox.getSelectedItem()).getDescription());// TODO add your handling code here:
    }//GEN-LAST:event_worldBoxActionPerformed

    private void selectWorldButtonActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_selectWorldButtonActionPerformed
        abbozza.setWorld((World) worldBox.getSelectedItem(),true);
    }//GEN-LAST:event_selectWorldButtonActionPerformed

    private void settingsItemActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_settingsItemActionPerformed
        AbbozzaServer abbozza = AbbozzaServer.getInstance();
        abbozza.openConfigDialog();
    }//GEN-LAST:event_settingsItemActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JTextArea descriptionPane;
    private javax.swing.JMenu jMenu1;
    private javax.swing.JMenuBar jMenuBar1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JPopupMenu.Separator jSeparator1;
    private javax.swing.JMenuItem quitITem;
    private javax.swing.JButton selectWorldButton;
    private javax.swing.JMenuItem settingsItem;
    private javax.swing.JComboBox<de.uos.inf.did.abbozza.worlds.World> worldBox;
    // End of variables declaration//GEN-END:variables

    public void open() {
        GUITool.centerWindow(this);
        this.setVisible(true);
        this.setState(JFrame.ICONIFIED);
    }
    
    public void setWorldAt(int idx) {
        this.worldBox.setSelectedIndex(0);
    }

    private void loadSketch(File file) {
        abbozza.setWorld((World) worldBox.getSelectedItem(),file);
    }
}
